import { Component, OnInit,ViewChild,ViewEncapsulation,Inject } from '@angular/core';
import { CoreService } from '../../../_service/core.service';
import {MatSort, MatTableDataSource,MatPaginator} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTabChangeEvent} from '@angular/material';




@Component({
  selector: 'app-active-record',
  templateUrl: './active-record.component.html',
  styleUrls: ['./active-record.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class ActiveRecordComponent implements OnInit {

  constructor(private _core :CoreService,private _modal: MatDialog,private _dataShare :DataShareService) { }

  tableData :Object[];
  showSpinner : boolean = true;
  dialogSpinner : boolean = false;
  dataSource : MatTableDataSource<any>;
  displayedColumns: string[] = ['bikeId', 'signOutDate', 'dueDate', 'status','manage'];

  tableDetail:Object = {};

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  
  ngOnInit() {
        this._core.activeRentalsDataCall().subscribe(res=>{ 
        this.showSpinner = false;
        this.tableData = res;
        this.dataSource = new MatTableDataSource(this.tableData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }



//table button on click(only required in active rental table)
  showMore(element){
    //this.dialogSpinner = true;
    this.tableDetail = element;
    this.openDialog();
  }

  openDialog(): void { 
       //this.dialogSpinner = false;
       const dialogRef = this._modal.open(DetailDialog, {
        data: this.tableDetail,
        height: '600px',
        width: '600px',
        autoFocus:false,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if(result != undefined){
        if(result['action']=='return'){
          this._core.returnBike(result['rentalId'],result['comment']).subscribe(res=>{
              console.log(res);
              this.removeTableCell(result);
          }) 
        }
        else if(result['action']=='change'){
          this._core.editRental(result['rentalId'],result['comment'],result['dueDate']).subscribe(res=>{
            console.log(res);
            this.changeTableCell(result);
          },error=>{console.log(error)}) 
        }
      }}) 
  }

  changeTableCell(result){
    for(let i in this.tableData){
      if(this.tableData[i]['rentalId'] == result['rentalId']){
        this.tableData[i]['comment'] = result['comment'];
        this.tableData[i]['dueDate'] = result['dueDate'];
        this.dataSource = new MatTableDataSource(this.tableData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        break;
      }
    }
  }


  removeTableCell(result){
    for(let i in this.tableData){
      if(this.tableData[i]['rentalId'] == result['rentalId']){
        this.tableData.splice(Number(i),1);
        this.dataSource = new MatTableDataSource(this.tableData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        //refresh the data share's bikelist since the back end update one bike availablity
          this._core.getBikeList().subscribe(res=>{
          //calling this will trigger the subscribe event that listening on bike list in other component
            this._dataShare.changeBikeList( JSON.parse(res));
            console.log(JSON.parse(res));
            }
          )
          break;
        }
      }
  }


}




//dialog class
import * as _moment from 'moment';
import { DataShareService } from 'src/app/_service/data-share.service';

@Component({
  selector: 'DetailDialog',
  templateUrl: 'active-rental.component.dialog.html'
})
export class DetailDialog {
  tabSwitch:boolean =false;

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }
  
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if(tabChangeEvent.index == 1){
      this.tabSwitch = true;
    }
    else{
      this.tabSwitch = false;
    }
  }

  //convert to moment formatted date string
  signOutDate:string;
  dueDate:string;

  constructor(
    public dialogRef: MatDialogRef<DetailDialog>,@Inject(MAT_DIALOG_DATA) public data: any) {
    }

    
    ngOnInit(){
      this.signOutDate = _moment(this.data.signOutDate).format();
      this.dueDate = _moment(this.data.dueDate).format();
      
    }


    closeCase(){
      console.log(this.data.rentalId) 
      this.dialogRef.close({rentalId:this.data.rentalId,comment:this.data.comment,action:'return'});

    }

    saveChanges(){
      //call service with modified fields
      console.log(this.data.comment)
      console.log(_moment(this.dueDate).format('YYYY-MM-DD'));
      console.log(this.data.rentalId)
      this.dialogRef.close({rentalId:this.data.rentalId,action:'change',comment:this.data.comment,dueDate:_moment(this.dueDate).format('YYYY-MM-DD')});


    }

    updateAmount(){

    }

  
    closeDialog(): void {
      this.dialogRef.close({action:'cancel'});
    }
}
