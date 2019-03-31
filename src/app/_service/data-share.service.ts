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

  constructor() { }

  changeShowForm(message: boolean) {
    this.showFormSource.next(message)
  }

  changeForm(message : Array<any>){
    this.FromRequiredSource.next(message)
  }

  changeSubmit(message : boolean){
    this.formSubmit.next(message);
  }



}
