import { Injectable } from '@angular/core';
import {HttpClient,HttpErrorResponse} from '@angular/common/http';
import { Observable,throwError} from 'rxjs';
import { catchError,retry} from 'rxjs/operators';

import {Router} from '@angular/router';
import { DataShareService } from './data-share.service';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient,private router:Router,private _dataShare:DataShareService,private notification:NotifierService) { }

  //user1 = {email:'hardcode@test.com',password:'12345',role:'Admin'};
  url:string = 'https://bike-rental-hmc.herokuapp.com/login';

  loginUser(user):Observable<any> {
    return this.http.post(this.url, {"email": user.email, "password": user.password}).pipe(
      catchError(()=>{
        this.notification.notify( 'error', 'Something bad happened, please try again later.' );
        return throwError(
        'Something bad happened; please try again later.')}))
  }

  loggedIn(){
    //probably send the token back to server and validate is better than checking local storage
    return !!localStorage.getItem('token')
  }

  logoutUser(){
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    this._dataShare.changeShowForm(false);
    this._dataShare.changeCustomerShowForm(false);
    this.router.navigate(['/login']);
  }

}
