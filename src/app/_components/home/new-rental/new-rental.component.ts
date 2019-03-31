import { Component, OnInit} from '@angular/core';
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
  styleUrls: ['./new-rental.component.css']
})
export class NewRentalComponent implements OnInit {

  sheridanId:String;
  errorMsg:String;
  hasResult:Boolean
  showSpinner:Boolean = false;
  comment:String;
  resultUserData:Object
  showForm:boolean =false;

  formData;

  
  emailFormControl;
  pEmailFormControl;
  nameFormControl;
  phoneFormControl;

  constructor(private _coreService:CoreService,private _dataShare:DataShareService) { }

  ngOnInit() {
    this._dataShare.currentMessage.subscribe(message => this.showForm = message)
    this._dataShare.currentForm.subscribe(message => this.formRequire = message)
    this._dataShare.currentFormSubmit.subscribe(message => {if(message){
      console.log("sending via core service");
      //only send the id and comment back 
      if(this.hasResult){
        this.formData = {sheridanId:this.resultUserData['sheridanId']};
        this.formData['newUser'] = false;
      }
      //send the user data back as this is a new user
      else{
        this.formData = this.resultUserData;
        this.formData['newUser'] = true;
      }
      this.formData['comment'] = this.comment
      console.log(this.formData);
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
  
    this.nameFormControl  = new FormControl({value:'',disabled:this.hasResult}, [
      Validators.required
    ]);
  
    this.phoneFormControl  = new FormControl({value:'',disabled:this.hasResult}, [
      Validators.required
    ]);
  }
  

  formRequire = []

  onChange(index){
    //this.formRequire[index] = flag

    switch (index) {
      case 0 : this.formRequire[0] = this.nameFormControl.hasError('required');
      break;
      case 1: this.formRequire[1] = this.emailFormControl.hasError('required') || this.emailFormControl.hasError('email');
      break; 
      case 2: this.formRequire[2] = this.pEmailFormControl.hasError('required') || this.pEmailFormControl.hasError('email');
      break;
      case 3: this.formRequire[3] = this.phoneFormControl.hasError('required');
      break;
    }
    console.log(this.formRequire)
    this._dataShare.changeForm(this.formRequire);
  }

  matcher = new MyErrorStateMatcher();


  submitId(){

    this.showSpinner = true;
    setTimeout(()=>{this._coreService.idQuery(this.sheridanId)
    .subscribe(res=>{ 
      if(res['body']['message']== 'newUser'){
        this.hasResult = false;
        this.resultUserData = {name:'',sheridanId:this.sheridanId,sheridanEmail:'',personalEmail:'',phone:''}    
        this._dataShare.changeForm([true,true,true,true]);
      }
      else{
        this.resultUserData = res['body'];
        console.log(this.resultUserData)
        this.hasResult = true
        this._dataShare.changeForm([false,false,false,false]);
      }
      this.createFormControl()
      this.showForm = true;
      this.showSpinner = false; 
      this._dataShare.changeShowForm(this.showForm);
    })
    },3000);
  }

}
