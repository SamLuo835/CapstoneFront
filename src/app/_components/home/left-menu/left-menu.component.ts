import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import {DataShareService} from '../../../_service/data-share.service';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent implements OnInit {

  formDisplay:boolean = false

  customerFormDisplay:boolean =false;

  formRequire : Array<any>

  customerFormRequire : Array<any>

  panelOpenState = true;

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
    this.subscriptions.push(this._dataShare.currentRetnalForm.subscribe(message => this.formDisplay = message))
    this.subscriptions.push(this._dataShare.currentCustomerForm.subscribe(message => this.customerFormDisplay = message))
    this.subscriptions.push(this._dataShare.currentFormRequire.subscribe(message => {this.formRequire = message}))
    this.subscriptions.push(this._dataShare.currentCustomerFormRequire.subscribe(message => {this.customerFormRequire = message}))
    this.subscriptions.push(this._dataShare.currentBikeList.subscribe(message =>{this.bikeList = message;this.checkAvailableBike()}));

  }


  checkAvailableBike(){
    if(!this.customerFormDisplay){
      for( var i in this.bikeList){
        if(this.bikeList[i]['bikeState'] == 'AVAILABLE'){
          return false; 
        }
      }
      return true;
    }
    else return false;
    }
  


  checkFormRequire(form){
    if(form == 'rental'){
      for(var i in this.formRequire){
        if(this.formRequire[i]){
            return true
          }
        }
        return false
      }
    if(form == 'customer'){
      for(var i in this.customerFormRequire){
        if(this.customerFormRequire[i]){
            return true
          }
        }
        return false
    }
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
      case 'newRental':
        this.componentIndex = 6
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
        break;
      case 'newCustomer':
        this.componentIndex = 7
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
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
    this.customerFormDisplay = false;
    this._dataShare.changeShowForm(this.formDisplay);
    this._dataShare.changeCustomerShowForm(this.customerFormDisplay);

  }

  cancel(form){
    if(form == 'rental'){
      this.formDisplay = false;
      this._dataShare.changeShowForm(this.formDisplay);
    }
    if(form == 'customer'){
      this.customerFormDisplay = false;
      this._dataShare.changeCustomerShowForm(this.customerFormDisplay);
      this.componentIndex = 1;
      this.messageEvent.emit(this.componentIndex);
      this.panelOpenState = true;
    }
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });   
  }

  submit(form){
    if(form == 'rental')
      this._dataShare.changeSubmit(true);
    if(form == 'customer'){
      console.log('customer submit')
      this._dataShare.changeCustomerSubmit(true);
    }
  }

}
