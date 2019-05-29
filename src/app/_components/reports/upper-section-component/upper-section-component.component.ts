import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgxDrpOptions, PresetItem, Range,PickerOverlayComponent } from 'ngx-mat-daterange-picker';
import * as _moment from 'moment';



@Component({
  selector: 'app-upper-section-component',
  templateUrl: './upper-section-component.component.html',
  styleUrls: ['./upper-section-component.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UpperSectionComponentComponent implements OnInit {

  constructor() { 
  }

  @ViewChild('dateRangePicker') dateRangePicker;

  init: boolean = false;
  total:Number = 100;
  average:Number = 7.5;
  user:Number = 100;
  late:Number = 200;

  range:Range = {fromDate:new Date(), toDate: new Date()};
  options:NgxDrpOptions;
  presets:Array<PresetItem> = [];
  ngOnInit() {
    
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth()-1, today.getDate());

    this.setupPresets();
    this.options = {
      presets: this.presets,
      format: 'mediumDate',
      applyLabel: "Submit",
      range: {fromDate:lastMonth, toDate: today},
      calendarOverlayConfig: {
        shouldCloseOnBackdropClick: false,
        hasBackdrop: true
       }
    }
  }

  
  // handler function that receives the updated date range object
    updateRange(range: Range): void {
      // init will prevent the double call in the initialization
      if (this.init) {
            this.range = range;
            console.log(_moment(this.range.fromDate).format("YYYY-MM-DD"))
            console.log(_moment(this.range.toDate).format("YYYY-MM-DD"))

      }
      else {
        this.init = true;
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

}
