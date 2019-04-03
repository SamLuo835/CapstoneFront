import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {AuthService} from '../../_service/auth.service';
import {Router} from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  errorMsg:String;
  checkedBox:Boolean = false;
  loginUserData = {email:'',password:''}

  constructor(private _auth: AuthService,private _router:Router) { }

  ngOnInit() {
    if(localStorage.getItem("rememberEmail")){
      this.checkedBox = true;
      this.loginUserData['email'] = localStorage.getItem("rememberEmail");
    }
  }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required,
  ]);

  matcher = new MyErrorStateMatcher();

  rememberCheck(event){
    if(event.checked){
      this.checkedBox = true;
    }
    else  this.checkedBox = false;

  }

  loginUser(){
    this._auth.loginUser(this.loginUserData).subscribe(
      res=>{
        localStorage.setItem('token',res['body']['token']);
        localStorage.setItem('role',res['body']['role']);
        if(this.checkedBox){
          localStorage.setItem("rememberEmail",this.loginUserData['email']);
        }
        else{
          localStorage.removeItem("rememberEmail");
        }
        this._router.navigate(['/home'])
    },
      err=>{
        this.errorMsg = err['body']['error']
        console.log(err)
      }
    );
  }
}
