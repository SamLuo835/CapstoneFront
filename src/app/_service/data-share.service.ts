import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {

  private showRentalFormSource = new BehaviorSubject(false);
  
  currentRetnalForm = this.showRentalFormSource.asObservable();

  private showWaiverSource = new BehaviorSubject(false);

  currentWaiverForm = this.showWaiverSource.asObservable();

  private showCustomerFormSource = new BehaviorSubject(false);

  currentCustomerForm = this.showCustomerFormSource.asObservable();

  private FromRequiredSource = new BehaviorSubject([]);

  currentFormRequire = this.FromRequiredSource.asObservable();

  private waiverFormRequiredSource = new BehaviorSubject(false);

  currentWaiverRequire = this.waiverFormRequiredSource.asObservable()

  private customerFormRequiredSource = new BehaviorSubject([]);

  currentCustomerFormRequire = this.customerFormRequiredSource.asObservable();

  private rentalFormSubmit = new BehaviorSubject(false);

  currentRentalFormSubmit = this.rentalFormSubmit.asObservable();

  private waiverSubmit = new BehaviorSubject(false);

  currentWaiverSubmit = this.waiverSubmit.asObservable();

  private customerFormSubmit = new BehaviorSubject(false);

  currentCustomerFormSubmit = this.customerFormSubmit.asObservable();

  private bikeList = new BehaviorSubject([]);

  currentBikeList = this.bikeList.asObservable();

  private lockList = new BehaviorSubject([]);
  currentLockList = this.lockList.asObservable();

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
  changeRentalShowForm(message: boolean) {
    this.showRentalFormSource.next(message)
  }

  changeCustomerShowForm(message:boolean){
    this.showCustomerFormSource.next(message)
  }

  changeShowWaiver(message:boolean){
    this.showWaiverSource.next(message)
  }



  //form required observable, disable the submit button and display error text when required field missing
  changeRentalFormRequire(message : Array<any>){
    this.FromRequiredSource.next(message)
  }
  changeWaiverFormRequire(message:boolean){
    this.waiverFormRequiredSource.next(message)  
  }

  changeCustomerFormRequire(message : Array<any>){
    this.customerFormRequiredSource.next(message)
  }

  //submit button event emit, as the submit button and the rental form are in different component
  changeRentalSubmit(message : boolean){
    this.rentalFormSubmit.next(message);
  }

  changeWaiverSubmit(message:boolean){
    this.waiverSubmit.next(message);
  }

  changeCustomerSubmit(message : boolean){
    this.customerFormSubmit.next(message);
  }


  //get the bikelist not via subscribing to the oberservable, 
  getBikeList(){
    return this.bikeList.getValue();
  }

  //Lock related
  getLockList() {
    return this.lockList.getValue();
  }
  changeLockList(message : Array<any>) {
    this.lockList.next(message);
  }
}
