import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {

  private showFormSource = new BehaviorSubject(false);
  
  currentMessage = this.showFormSource.asObservable();

  private FromRequiredSource = new BehaviorSubject([]);

  currentForm = this.FromRequiredSource.asObservable();

  private formSubmit = new BehaviorSubject(false);

  currentFormSubmit = this.formSubmit.asObservable();

  private bikeList = new BehaviorSubject([]);

  currentBikeList = this.bikeList.asObservable();

  constructor() { }


  changeBikeList(message : Array<any>){
    this.bikeList.next(message);
  }

  //toggle to show the rental form or not
  changeShowForm(message: boolean) {
    this.showFormSource.next(message)
  }

  //form required field observe
  changeForm(message : Array<any>){
    this.FromRequiredSource.next(message)
  }

  //submit button event emit
  changeSubmit(message : boolean){
    this.formSubmit.next(message);
  }


  //get the bikelist not via subscribing to the oberservable, 
  getBikeList(){
    return this.bikeList.getValue();
  }



}
