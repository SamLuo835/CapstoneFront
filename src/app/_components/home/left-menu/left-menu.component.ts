import { Component, OnInit,Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent implements OnInit {

  panelOpenState = true;
  
  @Output() messageEvent = new EventEmitter<number>();


  compoentIndex;

  constructor() { }

  ngOnInit() {
    this.compoentIndex = 1
    this.messageEvent.emit(this.compoentIndex);

  }

  buttonClick(_component){
    switch (_component){
      case 'bike': 
        this.compoentIndex = 1
        break;
      case 'lock':
        this.compoentIndex = 2
        break;
      case 'repair':
        this.compoentIndex = 3
        break;
      case 'active':
        this.compoentIndex = 4
        break;
      case 'archive':
        this.compoentIndex = 5
        break;
      case 'user':
        this.compoentIndex = 6
    }

    this.messageEvent.emit(this.compoentIndex);

    if(this.compoentIndex === 1 || this.compoentIndex === 2 || this.compoentIndex === 3){
      this.panelOpenState = true;
    } 
    else{
      this.panelOpenState = false;
    }
  }

}
