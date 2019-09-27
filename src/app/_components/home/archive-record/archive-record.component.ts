import { Component, OnInit, ViewChild, ViewEncapsulation, Inject ,ElementRef} from '@angular/core';
import { CoreService } from '../../../_service/core.service';
import {MatSort, MatTableDataSource,MatPaginator} from '@angular/material';
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

  constructor(private _core :CoreService,private notification :NotifierService ,private _dataShare :DataShareService) { }

  init: boolean = false;

  $searching:boolean = false;
  searchType:String = 'ID';

  tableData :Object[];
  showSpinner : boolean = true;
  dataSource : MatTableDataSource<any>;
  displayedColumns: string[] = [ 'id','signOutDate', 'dueDate', 'returnedDate', 'rentalState','detail'];

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
        this._core.archivedRentalsDataCall().subscribe(res=>{ 
          this.showSpinner = false;
          this.tableData = res;
          this.dataSource = new MatTableDataSource(this.tableData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
    } 
    else{
      console.log("using query Object");
      //TODO  use query object to search for records
      this._core.archivedRentalsDataCall().subscribe(res=>{ 
        this.showSpinner = false;
        this.tableData = res;
        this.dataSource = new MatTableDataSource(this.tableData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });

      if(this.queryMessage['bikeId'] != undefined){
        this.searchType = 'bikeID';
        this.input.nativeElement.value = this.queryMessage['bikeId'];
      }
      else if((this.queryMessage['userId'] != undefined)){
        this.searchType = 'ID';
        this.input.nativeElement.value = this.queryMessage['userId'];
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
            setTimeout(()=>{this._core.testReport().subscribe(res => {
              this.tableData = [];//res['body'];
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
                  this._core.testReport().subscribe(res=>{
                    this.tableData = [] //res;
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

    }

}
