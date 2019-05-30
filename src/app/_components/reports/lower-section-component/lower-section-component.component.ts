import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lower-section-component',
  templateUrl: './lower-section-component.component.html',
  styleUrls: ['./lower-section-component.component.css']
})
export class LowerSectionComponentComponent implements OnInit {

  constructor() { }
  totalStudent:Number = 311;
  totalStaff:Number = 233;
  historicalAvg:Number =4;
  
  ngOnInit() {
  }

}
