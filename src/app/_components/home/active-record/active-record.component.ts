import { Component, OnInit,ViewChild,ViewEncapsulation,Inject } from '@angular/core';
import { CoreService } from '../../../_service/core.service';
import {MatSort, MatTableDataSource,MatPaginator} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';




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
  displayedColumns: string[] = ['id', 'signoutdate', 'duedate', 'status','manage'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  
  ngOnInit() {
        setTimeout(()=>{this._core.tableDataCall().subscribe(res=>{ 
        this.showSpinner = false; 
        this.tableData=res['body']['table'];
        this.dataSource = new MatTableDataSource(this.tableData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })},3000);
  }



//table button on click(only required in active rental table)
  showMore(element){
    this.dialogSpinner = true;
    this.openDialog(element);
  }

  openDialog(element): void {
    

    setTimeout(()=>{this._core.tableDetailCall().subscribe(res=>{
       let shareData = res['body'];
       shareData['rentalId']=element.id;
       shareData['signoutdate']=element.signoutdate;
       shareData['duedate']=element.duedate;
       shareData['comment']=element.comment;
       shareData['status']=element.status
       this.dialogSpinner = false;
       const dialogRef = this._modal.open(DetailDialog, {
        data: shareData,
        height: '600px',
        width: '600px',
        autoFocus:false,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

        //this is removing the class scope variable tableData's element (need to wrap in inside the back end call)
        for(let i in this.tableData){
          if(this.tableData[i]['id'] == result){
            this.tableData.splice(Number(i),1);
            this.dataSource = new MatTableDataSource(this.tableData);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            //refresh the data share's bikelist
              this._core.getBikeList().subscribe(res=>{
              //calling this will trigger the subscribe event that listening on bike list in other component
                this._dataShare.changeBikeList( JSON.parse(res));
                console.log(res);
              }
            )
            break;
          }
        }
       


      });
    })},3000);
    ;

    
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
  
  constructor(
    public dialogRef: MatDialogRef<DetailDialog>,@Inject(MAT_DIALOG_DATA) public data: any) {
    }

    
    ngOnInit(){
      this.data.signoutdate = _moment(this.data.signoutdate).format();
      this.data.duedate = _moment(this.data.duedate).format();
    }


    closeCase(){
      //call service with rental id
      console.log(this.data.rentalId) 
      this.dialogRef.close(this.data.rentalId);

    }

    saveChanges(){
      //call service with modified fields
      console.log(this.data.comment)
      console.log(this.data.duedate);
      console.log(this.data.rentalId)

    }


  
    onClick(): void {
      this.dialogRef.close(this.data.rentalId);
    }
}
