import { Injectable } from '@angular/core';
import {HttpInterceptor} from '@angular/common/http';
import {AuthService} from '../_service/auth.service'
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements  HttpInterceptor{
  intercept(req: import("@angular/common/http").HttpRequest<any>, next: import("@angular/common/http").HttpHandler): import("rxjs").Observable<import("@angular/common/http").HttpEvent<any>> {
    let tokenizedReq = req.clone({
      setHeaders:{
        Authorization: `Bearer ${this._auth.loggedIn()}`
      }
    })
    return next.handle(tokenizedReq);
  }


  constructor(private _auth:AuthService) { }
}
