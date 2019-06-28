import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {

  private showFormSource = new BehaviorSubject(false);
  
  currentRetnalForm = this.showFormSource.asObservable();

  private showCustomerFormSource = new BehaviorSubject(false);

  currentCustomerForm = this.showCustomerFormSource.asObservable();

  private FromRequiredSource = new BehaviorSubject([]);

  currentFormRequire = this.FromRequiredSource.asObservable();

  private customerFormRequiredSource = new BehaviorSubject([]);

  currentCustomerFormRequire = this.customerFormRequiredSource.asObservable();

  private formSubmit = new BehaviorSubject(false);

  currentFormSubmit = this.formSubmit.asObservable();

  private customerFormSubmit = new BehaviorSubject(false);

  currentCustomerFormSubmit = this.customerFormSubmit.asObservable();

  private bikeList = new BehaviorSubject([]);

  currentBikeList = this.bikeList.asObservable();

  private redirectMessage = new BehaviorSubject(null);

  currentRedirectMessage = this.redirectMessage.asObservable();


  constructor() { }

  changeRedirectMessage(message : Object){
    this.redirectMessage.next(message);
  }

  getRedirectMessage(){
    return this.redirectMessage.getValue();
  }


  changeBikeList(message : Array<any>){
    this.bikeList.next(message);
  }

  //toggle to show the rental form or not, controls the left menu 'cancel rental' and 'submit rental' buttons visibility as well
  changeShowForm(message: boolean) {
    this.showFormSource.next(message)
  }

  changeCustomerShowForm(message:boolean){
    this.showCustomerFormSource.next(message)
  }



  //form required observable, disable the submit button and display error text when required field missing
  changeForm(message : Array<any>){
    this.FromRequiredSource.next(message)
  }

  changeCustomerForm(message : Array<any>){
    this.customerFormRequiredSource.next(message)
  }

  //submit button event emit, as the submit button and the rental form are in different component
  changeSubmit(message : boolean){
    this.formSubmit.next(message);
  }

  changeCustomerSubmit(message : boolean){
    this.customerFormSubmit.next(message);
  }


  //get the bikelist not via subscribing to the oberservable, 
  getBikeList(){
    return this.bikeList.getValue();
  }

}
