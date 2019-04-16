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

  subscriptions = [];
  
  @Output() messageEvent = new EventEmitter<number>();

  componentIndex:any;

  constructor(private _dataShare :DataShareService) { }

  ngOnDestroy(){
    this.subscriptions.forEach( s => s.unsubscribe());
  }

  ngOnInit() {
    this.componentIndex = 1
    //output emit is for child component to parent component(for left menu to home)
    this.messageEvent.emit(this.componentIndex);

    //for sibling or no relation components, share data with observables
    this.subscriptions.push(this._dataShare.currentMessage.subscribe(message => this.formDisplay = message))
    this.subscriptions.push(this._dataShare.currentForm.subscribe(message => {this.formRequire = message}))
    this.subscriptions.push(this._dataShare.currentBikeList.subscribe(message =>{this.bikeList = message;this.checkAvailableBike()}));

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
        this.componentIndex = 1
        break;
      case 'lock':
        this.componentIndex = 2
        break;
      case 'active':
        this.componentIndex = 3
        break;
      case 'archive':
        this.componentIndex = 4
        break;
      case 'customer':
        this.componentIndex = 5
        break;
      case 'new':
        this.componentIndex = 6
        break;
    }

    this.messageEvent.emit(this.componentIndex);

    if(this.componentIndex === 1 || this.componentIndex === 2 ){
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
