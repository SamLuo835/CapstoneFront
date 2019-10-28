import { Component, OnInit,ViewEncapsulation, ViewChild} from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators, Form} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {CoreService} from '../../../_service/core.service';
import {DataShareService} from '../../../_service/data-share.service';
import 'rxjs/add/operator/take'
import { NotifierService } from 'angular-notifier';
import { MatHorizontalStepper } from '@angular/material';
import * as _moment from 'moment';
import { Observable,forkJoin,fromEvent } from 'rxjs';

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
  basketSelected:String = "";
  resultUserData:Object = {};
  showForm:boolean = false;

  hasPayableHistory:boolean;
  payableCount:number;

  newRentalData={"comment":null,"customer":{}};  
  bikeFormControl:FormControl;
  lockFormControl:FormControl;
  basketFormControl:FormControl;

  observables : Observable<any>[] = [];

  
  lockList:Array<any> = [];
  basketList:Array<any> = [];
  bikeList:Array<any> = [];
  formRequire:Array<any> = [];
  subsctiptions:Array<any> = [];

  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  constructor(private _coreService:CoreService,private _dataShare:DataShareService,private notification :NotifierService) { }

  ngOnDestroy(){
    this._dataShare.changeRentalFormRequire([]);
    this.subsctiptions.forEach( s => s.unsubscribe());
  }

  ngOnInit() {
    this.subsctiptions.push(this._dataShare.currentRetnalForm.subscribe(message => this.showForm = message));
    //this.subsctiptions.push(this._dataShare.currentFormRequire.subscribe(message => this.formRequire = message));

    this.subsctiptions.push(this._dataShare.currentBikeList.subscribe(message => this.bikeList = message));
    this.subsctiptions.push(this._dataShare.currentRentalFormSubmit.subscribe(message => {if(message){
      this.showSpinner = true
      this.createRentalDetail();
      this.saveRental();
    }
  }))
  }



  createRentalDetail(){
      this.newRentalData['comment'] = this.comment
      this.newRentalData['customer']['sheridanId'] = this.resultUserData['sheridanId'];
      if(this.bikeSelected == 'Skip' && this.basketSelected =='Skip')
          this.newRentalData['rentalComponents'] = [{'@type':'LockItem','id':this.lockSelected}];
      if(this.bikeSelected != 'Skip' && this.basketSelected =='Skip')
          this.newRentalData['rentalComponents'] = [{'@type':'Bike','id':this.bikeSelected},{'@type':'LockItem','id':this.lockSelected}];
      if(this.bikeSelected == 'Skip' && this.basketSelected !='Skip')
          this.newRentalData['rentalComponents'] = [{'@type':'LockItem','id':this.lockSelected},{'@type':'Basket','id':this.basketSelected}];

  }


  saveRental(){
    this._coreService.newRental(this.newRentalData).subscribe(res=>{
      this.showSpinner = false;
      this._dataShare.changeRentalSubmit(false);
      this.showForm = false;
      this._dataShare.changeRentalShowForm(this.showForm);
      this.notification.notify( 'success', 'New Rental Created.' );
      //refresh the data share's bikelist since the back end update one bike availablity
      this._coreService.getBikeList().subscribe(res=>{
        //calling this will trigger the subscribe event that listening on bike list in other component
          this._dataShare.changeBikeList( JSON.parse(res));
          }
        )
    },error=>{
      this.showSpinner = false;
      this._dataShare.changeRentalSubmit(false);
      this.showForm = false;
      this._dataShare.changeRentalShowForm(this.showForm);
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
    this.basketFormControl = new FormControl('', [
      Validators.required
    ]);
  }
  
  onChange(){
    this.formRequire[0] = this.bikeFormControl.hasError('required');
    this.formRequire[1] = this.lockFormControl.hasError('required');
    this.formRequire[2] = this.basketFormControl.hasError('required');
    if(this.basketSelected == 'Skip' && this.lockSelected == 'Skip' && this.bikeSelected == 'Skip'){
      this.formRequire[3] = true;
    } 
    else{
      this.formRequire[3] = false;
    }
    if(this.stepper.selectedIndex == 0){
      this.lockSelected = "";
    }
    this._dataShare.changeRentalFormRequire(this.formRequire);
    this.stepper.next();
  }


  matcher = new MyErrorStateMatcher();

  checkAvaliableBaskets(){
    if(this.basketList.length == 0) return false;
    for(let index in this.basketList){
      if(this.basketList[index].keyState == 'AVAILABLE'){
          return true;
      }
      
    }

    return false;
  } 



  checkAvaliableBikes(){
    if(this.bikeList.length == 0) return false;
    for(let index in this.bikeList){
      if(this.bikeList[index].state == 'AVAILABLE'){
          return true;
      }
      
    }

    return false;
    }

  checkAvaliableLocks(){
    if(this.lockList.length == 0) return false;
    for(let index in this.lockList){
      if(this.lockList[index].state == 'AVAILABLE'){
          return true;
      }
      
    }

    return false;
  } 

  submitId(){
    //flush the selected value if user click cnacel and come back(the new rental component is not destroy)
    this.basketSelected="",
    this.bikeSelected="",
    this.lockSelected = "";
    this.errorMsg = null;
    this.showSpinner = true;
    this._coreService.getCustomerById(this.sheridanId)
    .subscribe(response=>{
      if(response.status == 200){
        this.resultUserData = response['body'];
        if(_moment(this.resultUserData['waiverExpirationDate']).isBefore(new Date())){
          this.showForm = false;
          this.showSpinner = false;
          this.errorMsg = "Customer waiver expired"
        }
        else{
            this._dataShare.changeRentalFormRequire([true]);
            this.comment = "";
            this.bikeSelected = ""; 
            this.createFormControl()
            this.showForm = true;
            this.observables.push( this._coreService.getLockList());
            this.observables.push( this._coreService.getPayablesByCustomerId(this.resultUserData['sheridanId']));
            //this.observables.push( this._coreService.getBasketList());

            forkJoin(this.observables).subscribe( results =>{
              this.showSpinner = false;
              this.lockList = JSON.parse((results[0]));
              //first one is locklist, second is payable list third is basketlist
              if(results[1].length!=0){
                this.hasPayableHistory = true;
                this.payableCount = results[1].length;
              }
              this.showSpinner = false;
              this._dataShare.changeRentalShowForm(this.showForm);
            }
          )   
          }
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



  redirectArchivedPage(){
    this.showForm = false;
    this._dataShare.changeRentalShowForm(this.showForm);

    this._dataShare.changeRedirectMessage({index:4,userId:this.resultUserData['sheridanId']});
  }

}
