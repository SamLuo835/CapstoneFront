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
  basketSelected:String = "";
  resultUserData:Object = {};
  showForm:boolean = false;
  showWaiver:boolean = false;

  hasPayableHistory:boolean;
  payableCount:number;

  newRentalData={"comment":null,"customer":{}};  
  bikeFormControl:FormControl;
  lockFormControl:FormControl;
  basketFormControl:FormControl;


  
  lockList:Array<any> = [];
  basketList:Array<any> = [];
  bikeList:Array<any> = [];
  formRequire:Array<any> = [];
  waiverFormRequire:boolean;
  subsctiptions:Array<any> = [];

  submitting:boolean = false;
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  constructor(private _coreService:CoreService,private _dataShare:DataShareService,private notification :NotifierService) { }

  ngOnDestroy(){
    this.subsctiptions.forEach( s => s.unsubscribe());
  }

  ngOnInit() {
    this.subsctiptions.push(this._dataShare.currentRetnalForm.subscribe(message => this.showForm = message));
    this.subsctiptions.push(this._dataShare.currentWaiverForm.subscribe(message => this.showWaiver = message));
    this.subsctiptions.push(this._dataShare.currentFormRequire.subscribe(message => this.formRequire = message));
    this.subsctiptions.push(this._dataShare.currentWaiverRequire.subscribe(message => this.waiverFormRequire = message));

    this.subsctiptions.push(this._dataShare.currentBikeList.subscribe(message => this.bikeList = message));
    this.subsctiptions.push(this._dataShare.currentFormSubmit.subscribe(message => {if(message){
      //show waiver
      this.createRentalDetail();
      this._dataShare.changeSubmit(false);
      this.showWaiver = true;
      this._dataShare.changeShowWaiver(this.showWaiver);
      this.showForm = false;
      this._dataShare.changeShowForm(this.showForm);
      this._dataShare.changeWaiverSubmit(false);
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });   
    }
  }))
  this.subsctiptions.push(this._dataShare.currentWaiverSubmit.subscribe(message => {
    if(message){
        this.submitting = true
        this.saveRental();
    }
    }
  ));

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
      this.submitting = false;
      this._dataShare.changeWaiverSubmit(false);
      this.showWaiver = false;
      this._dataShare.changeShowWaiver(this.showWaiver);
      this.notification.notify( 'success', 'New Rental Created.' );
      //refresh the data share's bikelist since the back end update one bike availablity
      this._coreService.getBikeList().subscribe(res=>{
        //calling this will trigger the subscribe event that listening on bike list in other component
          this._dataShare.changeBikeList( JSON.parse(res));
          }
        )
    },error=>{
      this.submitting = false;
      this._dataShare.changeWaiverSubmit(false);
      this.showWaiver = false;
      this._dataShare.changeShowWaiver(this.showWaiver);
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
    this._dataShare.changeForm(this.formRequire);
    this.stepper.next();
  }

  waiverCheck(){
    if(this.waiverFormRequire){
      this.waiverFormRequire = false;
    }
    else this.waiverFormRequire = true;
    this._dataShare.changeWaiverForm(this.waiverFormRequire);
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
        this._coreService.getPayablesByCustomerId(this.resultUserData['sheridanId']).subscribe(
          response => {
            if(response.length!=0){
              this.hasPayableHistory = true;
              this.payableCount = response.length;
            }

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


  getDate(){
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    var date = new Date()
    return date.getDate()+", "+ monthNames[date.getMonth()]+", "+ date.getFullYear(); 
  }

  getAcdemicYear(){
    var date = new Date()
    if(8 <= date.getMonth() &&  date.getMonth() <=11){
      return date.getFullYear()+1;
    }
    else return date.getFullYear();
  }

  redirectArchivedPage(){
    this.showForm = false;
    this._dataShare.changeShowForm(this.showForm);

    this._dataShare.changeRedirectMessage({index:4,userId:this.resultUserData['sheridanId']});
  }

}
