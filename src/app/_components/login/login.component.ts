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
        console.log(res);
        if(res.valid) {
          localStorage.setItem('token',res['token']);
          localStorage.setItem('role',res['role']);
          if(this.checkedBox){
            localStorage.setItem("rememberEmail",this.loginUserData['email']);
          }
          else{
            localStorage.removeItem("rememberEmail");
          }
          this._router.navigate(['/home'])
        } else {
          this.errorMsg = "Email or password are incorrect"
        }

          // if(user.email != this.user1.email){
          //   return  throwError(new HttpResponse({ body: { error: "This email is not registered" }, status: 403,statusText:'Not Found' }));
          // }
          // else if(user.password != this.user1.password){
          //   return  throwError(new HttpResponse({ body: { error: "The password is incorrect" }, status: 401 ,statusText:"Unauthorized"}));
          // }
          // else  return  of(new HttpResponse({ body: {email:'hardcode@test.com',role:'Admin',token:'fakeToken'}, status: 200 }));

        
        
      },
      err=>{
       // this.errorMsg = err['body']['error']
        console.log(err)
      }
    );
  }
}
