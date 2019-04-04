import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import {DataShareService} from '../../../_service/data-share.service';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent implements OnInit {

  formDisplay:boolean

  formRequire : Array<any>

  panelOpenState = true;

  noAvailableBike:Boolean;

  bikeList = [];
  
  @Output() messageEvent = new EventEmitter<number>();

  compoentIndex;

  constructor(private _dataShare :DataShareService) { }

  ngOnInit() {
    this.compoentIndex = 1
    this.messageEvent.emit(this.compoentIndex);
    this._dataShare.currentMessage.subscribe(message => this.formDisplay = message)

    this._dataShare.currentForm.subscribe(message => {this.formRequire = message})
    this._dataShare.currentBikeList.subscribe(message =>{ this.bikeList = message;this.checkAvailableBike()});

  }


  checkAvailableBike(){
      for( var i in this.bikeList){
        if(this.bikeList[i]['available']){
          this.noAvailableBike = false;
          return; 
        }
      }
      this.noAvailableBike = true;
    }
  


  checkFormRequire(){
    for(var i in this.formRequire){
      if(this.formRequire[i]){
        return true
      }
    }
    return false
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
        break;
      case 'new':
        this.compoentIndex = 7
        break;
    }

    this.messageEvent.emit(this.compoentIndex);

    if(this.compoentIndex === 1 || this.compoentIndex === 2 || this.compoentIndex === 3){
      this.panelOpenState = true;
    } 
    else{
      this.panelOpenState = false;
    }
    this.formDisplay = false;
    this._dataShare.changeShowForm(this.formDisplay);
  }

  cancel(){
    this.formDisplay = false;
    this._dataShare.changeShowForm(this.formDisplay);
  }

  submit(){
    this._dataShare.changeSubmit(true);
  }

}
