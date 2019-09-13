import { Component, OnInit,ViewEncapsulation, ViewChild} from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators, Form} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {CoreService} from '../../../_service/core.service';
import {DataShareService} from '../../../_service/data-share.service';
import 'rxjs/add/operator/take'
import { NotifierService } from 'angular-notifier';
import { MatHorizontalStepper } from '@angular/material';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-new-rental',
  templateUrl: './new-rental.component.html',
  styleUrls: ['./new-rental.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NewRentalComponent implements OnInit {

  sheridanId:String;
  errorMsg:String;
  showSpinner:Boolean = false;
  comment:String = "";
  bikeSelected:String = "";
  lockSelected:String = "";
  keySelected:String = "";
  resultUserData:Object = {};
  showForm:boolean =false;

  newRentalData={"comment":null,"customer":{},"bike":{}};  
  bikeFormControl:FormControl;
  lockFormControl:FormControl;
  keyFormControl:FormControl;

  lockList:Array<any> = [];
  keyList:Array<any> = [];
  bikeList:Array<any> = [];
  formRequire:Array<any> = [];
  subsctiptions:Array<any> = [];

  submitting:boolean = false;
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  constructor(private _coreService:CoreService,private _dataShare:DataShareService,private notification :NotifierService) { }

  ngOnDestroy(){
    this.subsctiptions.forEach( s => s.unsubscribe());
  }

  ngOnInit() {
    this.subsctiptions.push(this._dataShare.currentRetnalForm.subscribe(message => this.showForm = message));
    this.subsctiptions.push(this._dataShare.currentFormRequire.subscribe(message => this.formRequire = message));
    this.subsctiptions.push(this._dataShare.currentBikeList.subscribe(message => this.bikeList = message));
    this.subsctiptions.push(this._dataShare.currentFormSubmit.subscribe(message => {if(message){
      this.submitting = true;
      this.createCustomerRental();
    }
  }));
  }



  createCustomerRental(){
      this.newRentalData['comment'] = this.comment
      this.newRentalData['bike']['id'] = this.bikeSelected
      this.newRentalData['customer']['sheridanId'] = this.resultUserData['sheridanId'];
      this._coreService.newRental(this.newRentalData).subscribe(res=>{
        this.submitting = false;
        this._dataShare.changeSubmit(false);
        this.showForm = false;
        this._dataShare.changeShowForm(this.showForm);
        this.notification.notify( 'success', 'New Rental Created.' );
        //refresh the data share's bikelist since the back end update one bike availablity
        this._coreService.getBikeList().subscribe(res=>{
          //calling this will trigger the subscribe event that listening on bike list in other component
            this._dataShare.changeBikeList( JSON.parse(res));
            }
          )
      },error=>{
        this.submitting = false;
        this._dataShare.changeSubmit(false);
        this.showForm = false;
        this._dataShare.changeShowForm(this.showForm);
        console.log(error)})
  }

  idFormControl = new FormControl('', [
    Validators.required,
  ]);

  createFormControl(){
    this.bikeFormControl = new FormControl('', [
      Validators.required
    ]);
    this.lockFormControl = new FormControl('', [
      Validators.required
    ]);
    this.keyFormControl = new FormControl('', [
      Validators.required
    ]);
  }
  
  onChange(){
    this.formRequire[0] = this.bikeFormControl.hasError('required');
    this.formRequire[1] = this.lockFormControl.hasError('required');
    this.formRequire[2] = this.keyFormControl.hasError('required');

    console.log(this.formRequire)
    this._dataShare.changeForm(this.formRequire);
    console.log(this.lockSelected);
    if(this.lockSelected){
      for(let index in this.lockList){
        if(this.lockList[index]['id'] == this.lockSelected){
          this.keyList = this.lockList[index]['keyItems'];
      }
    }
  }
    this.stepper.next();
  }

  matcher = new MyErrorStateMatcher();

  checkAvaliableKeys(){
    if(this.keyList.length == 0) return false;
    for(let index in this.keyList){
      if(this.keyList[index].keyState == 'AVAILABLE'){
          return true;
      }
      
    }

    return false;
  } 

  checkAvaliableLocks(){
    if(this.lockList.length == 0) return false;
    for(let index in this.lockList){
      if(this.lockList[index].lockState == 'AVAILABLE'){
          return true;
      }
      
    }

    return false;
  } 

  submitId(){
    //flush the selected value if user click cnacel and come back(the new rental component is not destroy)
    this.keySelected="",
    this.bikeSelected="",
    this.lockSelected = "";
    this.errorMsg = null;
    this.showSpinner = true;
    this._coreService.getCustomerById(this.sheridanId)
    .subscribe(response=>{
      if(response.status == 200){
        this.resultUserData = response['body'];
        console.log(this.resultUserData);
        this._dataShare.changeForm([true]);
        this.comment = "";
        this.bikeSelected = ""; 
        this.createFormControl()
        this.showForm = true;
        this.showSpinner = false;
        this._dataShare.changeShowForm(this.showForm);
        this._coreService.getLockList().subscribe(
          response => {
            this.lockList = JSON.parse((response));
          }
        )
      }
      else if(response.status == 204){
        this.showForm = false;
        this.showSpinner = false;
        this.errorMsg = "Customer not found, please register first."
      }
    },error=>{ 
      this.showForm = false;
      this.showSpinner = false;})
  }

}
