import { Injectable } from '@angular/core';
import { CanActivate,Router } from '@angular/router';
import {AuthService} from './_service/auth.service';
@Injectable({
  providedIn: 'root'
})
export class RootGuard implements CanActivate {

constructor(private _authService:AuthService,private _router:Router){}

  canActivate():boolean{
    if(this._authService.loggedIn()){
      this._router.navigate(['/home']);
      return false
    }
    else{
      return true
    }
  }
}
