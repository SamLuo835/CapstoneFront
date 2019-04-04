import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse} from '@angular/common/http';
import { Observable, of ,throwError} from 'rxjs';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient,private router:Router) { }

  user1 = {email:'hardcode@test.com',password:'12345',role:'Admin'};
  // url = 'http://localhost:8082/login';
  url = 'https://bike-rental-hmc.herokuapp.com/login';

  loginUser(user):Observable<any> {
    return this.http.post(this.url, {"email": user.email, "password": user.password});
  }

  loggedIn(){
    //probably send the token back to server and validate is better than checking local storage
    return !!localStorage.getItem('token')
  }

  logoutUser(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
