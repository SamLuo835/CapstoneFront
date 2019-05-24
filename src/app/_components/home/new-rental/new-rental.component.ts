import { Component, OnInit,ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {CoreService} from '../../../_service/core.service';
import {DataShareService} from '../../../_service/data-share.service';
import 'rxjs/add/operator/take'
import { NotifierService } from 'angular-notifier';

import { Observable } from 'rxjs';

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
  encapsulation: ViewEncapsulation.None,

})
export class NewRentalComponent implements OnInit {

  sheridanId:String;
  errorMsg:String;
  showSpinner:Boolean = false;
  comment:String = "";
  bikeSelected:String = "";
  resultUserData:Object = {};
  showForm:boolean =false;

  newRentalData={"comment":null,"customer":{},"bike":{}};  
  bikeFormControl:FormControl;

  bikeList:Array<any> = [];
  formRequire:Array<any> = [];
  subsctiptions:Array<any> = [];

  constructor(private _coreService:CoreService,private _dataShare:DataShareService,private notification :NotifierService) { }

  ngOnDestroy(){
    this.subsctiptions.forEach( s => s.unsubscribe());
  }

  ngOnInit() {
    this.subsctiptions.push(this._dataShare.currentRetnalForm.subscribe(message => this.showForm = message));
    this.subsctiptions.push(this._dataShare.currentFormRequire.subscribe(message => this.formRequire = message));
    this.subsctiptions.push(this._dataShare.currentBikeList.subscribe(message => this.bikeList = message));
    this.subsctiptions.push(this._dataShare.currentFormSubmit.subscribe(message => {if(message){
      this._dataShare.changeSubmit(false);
      this.showForm = false;
      this._dataShare.changeShowForm(this.showForm);
      this.createCustomerRental();
    }
  }));
  }



  createCustomerRental(){
      this.newRentalData['comment'] = this.comment
      this.newRentalData['bike']['id'] = this.bikeSelected
      this.newRentalData['customer']['sheridanId'] = this.resultUserData['sheridanId'];
      this._coreService.newRental(this.newRentalData).subscribe(res=>{
        console.log(res);
        this.notification.notify( 'success', 'New Rental Created.' );
        //refresh the data share's bikelist since the back end update one bike availablity
        this._coreService.getBikeList().subscribe(res=>{
          //calling this will trigger the subscribe event that listening on bike list in other component
            this._dataShare.changeBikeList( JSON.parse(res));
            }
          )
      },error=>{console.log(error)})
  }

  idFormControl = new FormControl('', [
    Validators.required,
  ]);

  createFormControl(){
    this.bikeFormControl = new FormControl('', [
      Validators.required
    ]);
  }
  
  onChange(){
    this.formRequire[0] = this.bikeFormControl.hasError('required');
    console.log(this.formRequire)
    this._dataShare.changeForm(this.formRequire);
  }

  matcher = new MyErrorStateMatcher();


  submitId(){
    this.showSpinner = true;
    setTimeout(()=>{this._coreService.getCustomerById(this.sheridanId)
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
      }
      else if(response.status == 204){
        this.showForm = false;
        this.showSpinner = false;
        this.errorMsg = "Customer not found, please register first."
      }
    })
    },1000);
  }

}
