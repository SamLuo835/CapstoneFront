import { Component, OnInit, ViewChild, ViewEncapsulation, Inject ,ElementRef} from '@angular/core';
import { CoreService } from '../../../_service/core.service';
import {MatSort, MatTableDataSource,MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTabChangeEvent} from '@angular/material';
import { NgxDrpOptions, PresetItem, Range } from 'ngx-mat-daterange-picker';
import { NotifierService } from 'angular-notifier';
import * as _moment from 'moment';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { DataShareService } from 'src/app/_service/data-share.service';

@Component({
  selector: 'app-archive-record',
  templateUrl: './archive-record.component.html',
  styleUrls: ['./archive-record.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class ArchiveRecordComponent implements OnInit {

  constructor(private _modal: MatDialog,private _core :CoreService,private notification :NotifierService ,private _dataShare :DataShareService) { }

  init: boolean = false;

  $searching:boolean = false;
  searchType:String = 'ID';

  tableData :Object[];
  showSpinner : boolean = true;
  dataSource : MatTableDataSource<any>;
  displayedColumns: string[] = [ 'id', 'bike-id', 'signOutDate', 'dueDate', 'returnedDate', 'rentalState','detail'];

  tableDetail:Object = {};

  range:Range = {fromDate:new Date(), toDate: new Date()};
  options:NgxDrpOptions;
  presets:Array<PresetItem> = [];
  queryMessage : Object ;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;


  ngOnInit() {

    this.queryMessage = this._dataShare.getRedirectMessage();

    if(this.queryMessage == null){
      this.getAllArchivedRental();
    } 
    else{
      //TODO  use query object to search for records
      if(this.queryMessage['bikeId'] != undefined){
        //this.searchType = 'bikeID';
        //this.input.nativeElement.value = this.queryMessage['bikeId'];
        //TODO not sure serach by bikeId
        this.getAllArchivedRental();

      }
      else if((this.queryMessage['userId'] != undefined)){
        this.searchType = 'ID';
        this.input.nativeElement.value = this.queryMessage['userId'];
        this._core.searchArchivedByCustId(this.queryMessage['userId']).subscribe(res=>{ 
          if(res==null){
            res=[]
          }
          this.showSpinner = false;
          this.tableData = res;
          this.dataSource = new MatTableDataSource(this.tableData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
  
      }

      this.queryMessage = null;
      this._dataShare.changeRedirectMessage(this.queryMessage);
    }
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth()-1, today.getDate());

    this.setupPresets();
    this.options = {
      presets: this.presets,
      placeholder: "Choose a Date Range",
      format: 'mediumDate',
      applyLabel: "Submit",
      range: {fromDate:lastMonth, toDate: today},
      calendarOverlayConfig: {
        shouldCloseOnBackdropClick: true,
        hasBackdrop: true
       }
    }
  }


  getAllArchivedRental(){
    this._core.archivedRentalsDataCall().subscribe(res=>{ 
      this.showSpinner = false;
      this.tableData = res;
      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  setupPresets() {
 
    const backDate = (numOfDays) => {
      const today = new Date();
      return new Date(today.setDate(today.getDate() - numOfDays));
    }
    
    const today = new Date();
    const minus30 = backDate(30);
    const lastThreeMonthStart = new Date(today.getFullYear(), today.getMonth()-3, today.getDate());
    const lastSixMonthStart = new Date(today.getFullYear(), today.getMonth()-6, today.getDate());
    const lastYear =  new Date(today.getFullYear()-1, today.getMonth(), today.getDate()); 
    
    this.presets =  [
      {presetLabel: "Last 30 Days", range:{ fromDate:minus30, toDate:today }},
      {presetLabel: "Last 3 Months", range:{ fromDate:lastThreeMonthStart, toDate:today }},
      {presetLabel: "Last 6 Months", range:{ fromDate: lastSixMonthStart, toDate:today }},
      {presetLabel: "Last year", range:{ fromDate: lastYear, toDate:today }}
    ]
  }


   // handler function that receives the updated date range object
   updateRange(range: Range): void {
    // init will prevent the double call in the initialization
    if (this.init) {
          if(_moment(range.fromDate).isAfter(range.toDate)){
            this.notification.notify( 'error', 'From Date Is After To Date.' );
            return;
          }
          else{
            this.$searching = true;
            this.range = range;
            console.log(_moment(this.range.fromDate).format("YYYY-MM-DD"))
            console.log(_moment(this.range.toDate).format("YYYY-MM-DD"))
            console.log(this.searchType);
            setTimeout(()=>{this._core.searchArchivedByDate(this.searchType,_moment(this.range.fromDate).format("YYYY-MM-DD"),_moment(this.range.toDate).format("YYYY-MM-DD")).subscribe(res => {
              if (res===null){res=[]}
              this.tableData = res
              this.dataSource.paginator.pageIndex = 0;
              this.dataSource = new MatTableDataSource(this.tableData)
              this.dataSource.paginator = this.paginator;
              this.dataSource.paginator.pageIndex = 0;
              this.dataSource.paginator.length = this.tableData.length;
              this.$searching = false;
            })},1000);
          }

    }
    else {
      this.init = true;
    }
  }


  ngAfterViewInit() {

    // server-side search
    fromEvent(this.input.nativeElement,'keyup')
        .pipe(
            debounceTime(800),
            distinctUntilChanged(),
            tap(() => {
              console.log(this.input.nativeElement.value)
              this.$searching = true;
              setTimeout(()=>{
                if(this.input.nativeElement.value == ""){
                  this._core.archivedRentalsDataCall().subscribe(res=>{ 
                    this.tableData = res;
                    this.dataSource.paginator.pageIndex = 0;
                    this.dataSource = new MatTableDataSource(this.tableData)
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.paginator.pageIndex = 0;
                    this.dataSource.paginator.length = this.tableData.length;
                  })
                }
                else{
                  this._core.searchArchivedByCustId(this.input.nativeElement.value).subscribe(res=>{
                    if(res == null){
                      res = []
                    }
                    this.tableData = res
                    this.dataSource.paginator.pageIndex = 0;
                    this.dataSource = new MatTableDataSource(this.tableData)
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.paginator.pageIndex = 0;
                    this.dataSource.paginator.length = this.tableData.length;
                  })
                }
                this.$searching = false;
              },1500); ; 
            })
        )
        .subscribe();
    }


    showMore(element){
        this.tableDetail = element;
        this.openDialog();
    }


    openDialog(): void { 
      //this.dialogSpinner = false;
      const dialogRef = this._modal.open(ArchivedDialog, {
       data: this.tableDetail,
       height: '600px',
       width: '600px',
       autoFocus:false,
       disableClose: true
     });
     dialogRef.afterClosed().subscribe(result => {
       console.log('The dialog was closed');
       if(result != undefined){
        if(result['action']=='change'){
         this._core.editRental(result['rentalId'],result['comment'],result['dueDate']).subscribe(res=>{
           console.log(res);
         },error=>{console.log(error)}) 
       }
     }}) 
 }

}


//dialog class
import {CdkDragDrop,copyArrayItem,} from '@angular/cdk/drag-drop';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'ArchivedDialog',
  templateUrl: 'archive-record.component.dialog.html'
})
export class ArchivedDialog {
  categoryList = [];
  rowEditMode = [];
  
  predefinedCat = []

  tabSwitch:boolean = false;
  currentIndex ;

  total:number = 0;
  previousCategory:number = 0;
  hoverText:boolean = false;
  //convert to moment formatted date string
  signOutDate:string;
  dueDate:string;

  returnDate:string;

  categoryNameControl  = new FormControl({value:'',disabled:false}, [
    Validators.required,
  ]);

  categoryValueControl = new FormControl({value:'0',disabled:false}, [
    Validators.required,
  ]);

  constructor( 
    public dialogRef: MatDialogRef<ArchivedDialog>,@Inject(MAT_DIALOG_DATA) public data: any,private notification :NotifierService,
    public _core: CoreService) { }


    ngOnInit(){
      this._core.getAllPredefinedPayables().subscribe(res=>{
        res.forEach(preDefPayable => {
          let category = preDefPayable.category;
          let value = preDefPayable.value;
  
          this.predefinedCat[this.predefinedCat.length] = {"category": category, "value": value, "isPaid": false, 'rental':{'id':this.data.id}};
        });
      });

      this.signOutDate = _moment(this.data['signOutDate']).format();
      this.dueDate = _moment(this.data['dueDate']).format();
      this.returnDate = _moment(this.data['returnedDate']).format();
      this._core.getPayablesById(this.data.id).subscribe(res=>{
        for(var i in res){
          this.total += res[i].value;
        } 
        this.categoryList = JSON.parse(JSON.stringify(res));
        this.rowEditMode = new Array(this.categoryList.length).fill(false);
      });
    }

   
    tabChanged(tabChangeEvent: MatTabChangeEvent): void {
      if(tabChangeEvent.index == 1){
        this.tabSwitch = true;
      }
      else{
        this.tabSwitch = false;
      }
    }

    closeDialog(): void {
      this.dialogRef.close({action:'cancel'});
    }
    enterEditMode(i){
      if(!this.checkEditModeOn()){
          this.rowEditMode[i] = true
          this.previousCategory = this.categoryList[i].value;
       }
    }

    confirmEdit(i){
      if(this.categoryNameControl.hasError('required') || this.categoryValueControl.hasError('required')){
        return;
      }
      this.categoryNameControl.setErrors({required:false})
      this.categoryValueControl.setErrors({required:false})
      this.rowEditMode[i] = false;
      this.total -= this.previousCategory;
      this.total += this.categoryList[i].value;
      this.previousCategory = 0;
    }

    addTableRow(){
      this.rowEditMode.unshift(true);    
      this.categoryList.unshift({'category':'','value':0,'paid':false,'rental':{'id':this.data.id}});
    }

    deleteRow(i){
      this.categoryNameControl.setErrors({required:false})
      this.categoryValueControl.setErrors({required:false})
      this.categoryList.splice(i,1);
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
        if(this.rowEditMode[i]==true){
          return true;
        }
      }
      return false;
    }

    updateReceivables(){
      if(this.checkEditModeOn()){
        this.notification.notify( 'error', 'Please confirm unsave category first.' );
      }
      else{
        this._core.updatePayables(this.data.id, this.categoryList).subscribe(res => {
          this.notification.notify('success', "Receivables Updated.");
        });
      }
    }

    drop(event: CdkDragDrop<string[]>) {
      if (event.previousContainer === event.container) {
      } else {
        copyArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);
              
        this.total += event.container.data[event.currentIndex]['value'];
        this.rowEditMode.unshift(false);    
        this.categoryList[0].rental['id'] = this.data.id;
      }
    }

    hoverIn(i){
        this.currentIndex = i;
        this.hoverText = true;
    }

    hoverOut(){
      this.currentIndex = null;
      this.hoverText = false;
    }
}