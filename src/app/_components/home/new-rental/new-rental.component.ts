import { Component, OnInit,ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {CoreService} from '../../../_service/core.service';
import {DataShareService} from '../../../_service/data-share.service';


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
  hasResult:Boolean
  showSpinner:Boolean = false;
  comment:String = "";
  bikeSelected:String = "";
  resultUserData:Object = {};
  showForm:boolean =false;

  newCustomerData={};
  newRentalData={"comment":null,"customer":{},"bike":{}};
  
  emailFormControl;
  pEmailFormControl;
  firstNameFormControl;
  lastNameFormControl
  phoneFormControl;
  bikeFormControl;
  custTypeFormControl;

  bikeList = [];

  constructor(private _coreService:CoreService,private _dataShare:DataShareService) { }

  ngOnInit() {
    this._dataShare.currentMessage.subscribe(message => this.showForm = message)
    this._dataShare.currentForm.subscribe(message => this.formRequire = message)
    this._dataShare.currentBikeList.subscribe(message => this.bikeList = message)
    this._dataShare.currentFormSubmit.subscribe(message => {if(message){
      // send the ids and comment back to create a new rental
      console.log(this.hasResult);
      if(this.hasResult){
        this.newRentalData['comment'] = this.comment
        this.newRentalData['bike']['id'] = this.bikeSelected
        this.newRentalData['customer']['sheridanId'] = this.resultUserData['sheridanId'];
        console.log(this.newRentalData)
        this._coreService.newRental(this.newRentalData).subscribe(res=>{
          console.log(res);
          //refresh the data share's bikelist since the back end update one bike availablity
          this._coreService.getBikeList().subscribe(res=>{
            //calling this will trigger the subscribe event that listening on bike list in other component
              this._dataShare.changeBikeList( JSON.parse(res));
              }
            )
        },error=>{console.log(error)})
      }
      //send the user data back and rental in two request to create new customer and new rental
      else{
        this.newCustomerData = this.resultUserData;
        console.log(this.newCustomerData)
        this._coreService.newCustomer(this.newCustomerData).subscribe(res => {
          console.log(res);
          this.newRentalData['bike']['id'] = this.bikeSelected
          this.newRentalData['comment'] = this.comment
          this.newRentalData['customer']['sheridanId'] = this.resultUserData['sheridanId'];
          this._coreService.newRental(this.newRentalData).subscribe(res =>{
            console.log(res);
            //refresh the data share's bikelist since the back end update one bike availablity
              this._coreService.getBikeList().subscribe(res=>{
            //calling this will trigger the subscribe event that listening on bike list in other component
              this._dataShare.changeBikeList( JSON.parse(res));
              }
            )
          })
        })
      }
     
      this.showForm = false;
      this._dataShare.changeShowForm(this.showForm);
      this._dataShare.changeSubmit(false);
    }
  })
  }

  idFormControl = new FormControl('', [
    Validators.required,
  ]);

  createFormControl(){ 
  
    this.emailFormControl  = new FormControl({value:'',disabled:this.hasResult}, [
      Validators.required,
      Validators.email
    ]);
  
    this.pEmailFormControl  = new FormControl({value:'',disabled:this.hasResult}, [
      Validators.required,
      Validators.email
    ]);
  
    this.firstNameFormControl  = new FormControl({value:'',disabled:this.hasResult}, [
      Validators.required
    ]);

    this.lastNameFormControl  = new FormControl({value:'',disabled:this.hasResult}, [
      Validators.required
    ]);
  
    this.phoneFormControl  = new FormControl({value:'',disabled:this.hasResult}, [
      Validators.required
    ]);

    this.bikeFormControl = new FormControl('', [
      Validators.required
    ]);

    this.custTypeFormControl= new FormControl({value:'',disabled:this.hasResult}, [
      Validators.required
    ]);
  }
  

  formRequire = []

  onChange(index){
    //this.formRequire[index] = flag

    switch (index) {
      case 0 : this.formRequire[0] = this.firstNameFormControl.hasError('required');
      break;
      case 1 : this.formRequire[1] = this.lastNameFormControl.hasError('required');
      break;
      case 2: this.formRequire[2] = this.emailFormControl.hasError('required') || this.emailFormControl.hasError('email');
      break; 
      case 3: this.formRequire[3] = this.pEmailFormControl.hasError('required') || this.pEmailFormControl.hasError('email');
      break;
      case 4: this.formRequire[4] = this.phoneFormControl.hasError('required');
      break;
      case 5: this.formRequire[5] = this.custTypeFormControl.hasError('required');
      break;
      case 6: this.formRequire[6] = this.bikeFormControl.hasError('required');
      break;
      
    }
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
        this.hasResult = true; 
        this._dataShare.changeForm([false,false,false,false,false,false,true]);
      }
      else if(response.status == 204){
        this.hasResult = false;
        this.resultUserData = {firstName:'',lastName:'',type:'',sheridanId:this.sheridanId,sheridanEmail:'',personalEmail:'',phone:''}   
        this._dataShare.changeForm([true,true,true,true,true,true,true]);
      }
      this.comment = "";
      this.bikeSelected = ""; 
      this.createFormControl()
      this.showForm = true;
      this.showSpinner = false; 
      this._dataShare.changeShowForm(this.showForm);
    })
    },1000);
  }

}
