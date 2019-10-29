import { Component, OnInit,ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {CoreService} from '../../../_service/core.service';
import {DataShareService} from '../../../_service/data-share.service';
import 'rxjs/add/operator/take'
import { NotifierService } from 'angular-notifier';


export class newCustomerData{
  firstName:String ="";
  lastName:String ="";
  phone:String ="";
  personalEmail:String ="";
  sheridanEmail:String ="";
  type:String ="";
  sheridanId:String ="";

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NewCustomerComponent implements OnInit {

  customerData : newCustomerData = new newCustomerData();

  showForm:boolean =false;

  subsctiptions = [];

  formRequire = [];

  submitting :boolean = false;

  showWaiver:boolean = false;



  constructor(private _coreService:CoreService,private _dataShare:DataShareService,private notification :NotifierService) { }

  ngOnDestroy(){
    this._dataShare.changeCustomerFormRequire([]);
    this._dataShare.changeWaiverFormRequire(false);
    this.subsctiptions.forEach( s => s.unsubscribe());

  }

  ngOnInit() {
    this.subsctiptions.push(this._dataShare.currentCustomerForm.subscribe(message => this.showForm = message));
    this.subsctiptions.push(this._dataShare.currentWaiverForm.subscribe(message => this.showWaiver = message));
    //this.subsctiptions.push(this._dataShare.currentCustomerFormRequire.subscribe(message => this.formRequire = message));
    this.subsctiptions.push(this._dataShare.currentCustomerFormSubmit.subscribe(message => { if(message){
      this._dataShare.changeCustomerSubmit(false);
      //show waiver
      this.showWaiver = true;
      this._dataShare.changeShowWaiver(this.showWaiver);
      this.showForm = false;
      this._dataShare.changeCustomerShowForm(this.showForm);
      this._dataShare.changeWaiverSubmit(false);
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });   
    }}));
    this.subsctiptions.push(this._dataShare.currentWaiverSubmit.subscribe(message => {
      if(message){
         this.createCustomer();
        }
      }
    ));
  }

  createCustomer(){
    this.submitting = true;
    this._coreService.getCustomerById(this.customerData.sheridanId)
    .subscribe(response=>{
      if(response.status == 200){
        this.submitting = false;
        this.notification.notify( 'error', 'Customer Already Registered.' );
      }
      else if(response.status == 204){
          this._coreService.newCustomer(this.customerData).subscribe(res => {
            this.submitting = false;
            this.notification.notify( 'success', 'New Customer Created.' );
            this.showWaiver = false;
            this._dataShare.changeShowWaiver(this.showWaiver);
            this.customerData = new newCustomerData();
            this._dataShare.changeWaiverFormRequire(false)

            this.formRequire = []
        },error=>{this.submitting = false;        
      })
      }
    },error=>{ this.submitting = false;
    })
    this._dataShare.changeWaiverSubmit(false);
  }


  matcher = new MyErrorStateMatcher();

  emailFormControl  = new FormControl({value:'',disabled:false}, [
    Validators.required,
    Validators.email
  ]);

  pEmailFormControl  = new FormControl({value:'',disabled:false}, [
    Validators.required,
    Validators.email
  ]);

  firstNameFormControl  = new FormControl({value:'',disabled:false}, [
    Validators.required
  ]);

  lastNameFormControl  = new FormControl({value:'',disabled:false}, [
    Validators.required
  ]);

  phoneFormControl  = new FormControl({value:'',disabled:false}, [
    Validators.required
  ]);

  custTypeFormControl = new FormControl({value:'',disabled:false}, [
    Validators.required
  ]);

  idFormControl = new FormControl({value:'',disables:false},[Validators.required]);


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
      case 6: this.formRequire[6] = this.idFormControl.hasError('required');
      break;   
    }
    console.log(this.formRequire)
    this._dataShare.changeCustomerFormRequire(this.formRequire);
  }


  receiveMessage($event){
    if($event){
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });    
      this.showForm = true;
      this._dataShare.changeCustomerShowForm(this.showForm);
      this.formRequire = [true,true,true,true,true,true]
      this._dataShare.changeCustomerFormRequire(this.formRequire);
    }
  }
}
