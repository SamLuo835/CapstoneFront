import { Injectable } from '@angular/core';
import {HttpClient,HttpErrorResponse} from '@angular/common/http';
import { Observable,throwError} from 'rxjs';
import { catchError,retry} from 'rxjs/operators';

import {Router} from '@angular/router';
import { DataShareService } from './data-share.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient,private router:Router,private _dataShare:DataShareService) { }

  //user1 = {email:'hardcode@test.com',password:'12345',role:'Admin'};
  url:string = 'https://bike-rental-hmc.herokuapp.com/login';

  loginUser(user):Observable<any> {
    return this.http.post(this.url, {"email": user.email, "password": user.password}).pipe(
      catchError(this.handleError))
  }

  loggedIn(){
    //probably send the token back to server and validate is better than checking local storage
    return !!localStorage.getItem('token')
  }

  logoutUser(){
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    this._dataShare.changeShowForm(false);
    this.router.navigate(['/login']);
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, `
        );
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

}
