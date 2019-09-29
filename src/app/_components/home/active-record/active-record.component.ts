import { Component, OnInit,ViewChild,ViewEncapsulation,Inject, ElementRef } from '@angular/core';
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
  displayedColumns: string[] = ['id', 'signOutDate', 'dueDate', 'rentalState','manage'];

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
      if(this.tableData[i]['id'] == result['rentalId']){
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
      if(this.tableData[i]['id'] == result['rentalId']){
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
import { NotifierService } from 'angular-notifier';
import {CdkDragDrop, moveItemInArray,copyArrayItem,} from '@angular/cdk/drag-drop';

@Component({
  selector: 'DetailDialog',
  templateUrl: 'active-rental.component.dialog.html'
})
export class DetailDialog {
  exampleJson = []
  rowEditMode =new Array(this.exampleJson.length).fill(false);
  predefinedCat = [{'category':'Bike Lost','fee':300,'paid':false},{'category':'Lock Lost','fee':60,'paid':false},{'category':'Key Lost','fee':30,'paid':false},
                  {'category':'Basket Lost','fee':50,'paid':false},{'category':'Light Lost','fee':5,'paid':false},{'category':'Bike Damage','fee':5,'paid':false},
                  {'category':'Key Damage','fee':5,'paid':false}]

  tabSwitch:boolean = false;
 
  readyToClosed:boolean;
  total:number = 0;
  previousCategory:number = 0;
  hoverText:boolean = false;


  closeReadyCheck(){
    for(var i in this.exampleJson){
      if(this.exampleJson[i].paid == false){
        return false;
      }
    }
    return true;
  }

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
    public dialogRef: MatDialogRef<DetailDialog>,@Inject(MAT_DIALOG_DATA) public data: any,private notification :NotifierService) {
      
    }

    
    ngOnInit(){
      this.signOutDate = _moment(this.data.signOutDate).format();
      this.dueDate = _moment(this.data.dueDate).format();
      for(var i in this.exampleJson){
        this.total += this.exampleJson[i].fee;
      }
    }

    enterEditMode(i){
      if(!this.checkEditModeOn()){
       if(this.exampleJson[i]['paid'] == true ){
          return
        }
        else {
          console.log("hello");
          this.rowEditMode[i] = true
          this.previousCategory = this.exampleJson[i].fee;
          console.log(this.rowEditMode);
        }
       }
    }

    confirmEdit(i){

      this.rowEditMode[i] = false;
      this.total -= this.previousCategory;
      this.total += this.exampleJson[i].fee;
      this.previousCategory = 0;
      //if(this.newRowMode == true){
      //  this.newRowMode = false;
      //}
    }

    addTableRow(){
      this.rowEditMode.unshift(true);    
      this.exampleJson.unshift({'category':'Enter Name','fee':0,'paid':false});
      //this.newRowMode=true;

    }

    deleteRow(i){
      this.exampleJson.splice(i,1);
      //this.newRowMode = false;
      this.rowEditMode.splice(i,1);
      this.total -= this.previousCategory;
      this.previousCategory = 0;
    }


    isEditMode(i){
      if(this.rowEditMode[i] == true){
        return true;
      }
      else return false;
    }

    checkEditModeOn(){
      for(var i in this.rowEditMode){
        if(this.rowEditMode[i] == true){
          return true;
      }
      }
      return false;

    }

    updateCase(){
      console.log(this.data.id);
      if(this.checkEditModeOn){
        this.notification.notify( 'error', 'Please confirm unsave category first.' );
      }
      else{
        this.dialogRef.close({rentalId:this.data.id,comment:this.data.comment,action:'update'});
      }
    }

    closeCase(){
      console.log(this.data.id)
      if(this.checkEditModeOn){
        this.notification.notify( 'error', 'Please confirm unsave category first.' );
      }
      else{
      this.dialogRef.close({rentalId:this.data.id,comment:this.data.comment,action:'return'});
      }
    }    

    saveChanges(){
      //call service with modified fields
      console.log(this.data.comment)
      console.log(_moment(this.dueDate).format('YYYY-MM-DD'));
      console.log(this.data.id)
      this.dialogRef.close({rentalId:this.data.id,action:'change',comment:this.data.comment,dueDate:_moment(this.dueDate).format('YYYY-MM-DD')});


    }
  
    closeDialog(): void {
      this.dialogRef.close({action:'cancel'});
    }

    drop(event: CdkDragDrop<string[]>) {
      if (event.previousContainer === event.container) {
      } else {
        copyArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);
              
        this.total += event.container.data[event.currentIndex]['fee'];
      }
    }

    currentIndex ;
    hoverIn(i){
        this.currentIndex = i;
        this.hoverText = true;
    }

    hoverOut(i){
      this.hoverText = false;
    }


      
}


