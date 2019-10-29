import { Component, OnInit,Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.css']
})
export class TermsConditionComponent implements OnInit {

  constructor() { }
  @Output() messageEvent = new EventEmitter<boolean>();

  ngOnInit() {
  }
  accept(){
    this.messageEvent.emit(true);
  }
}
