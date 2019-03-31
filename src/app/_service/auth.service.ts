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

  loginUser(user):Observable<any> {
    if(user.email != this.user1.email){
      return  throwError(new HttpResponse({ body: { error: "This email is not registered" }, status: 403,statusText:'Not Found' }));
    }
    else if(user.password != this.user1.password){
      return  throwError(new HttpResponse({ body: { error: "The password is incorrect" }, status: 401 ,statusText:"Unauthorized"}));
    }
    else  return  of(new HttpResponse({ body: {email:'hardcode@test.com',role:'Admin',token:'fakeToken'}, status: 200 }));
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
