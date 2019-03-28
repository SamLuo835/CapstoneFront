import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, TimeoutDialog} from './app.component';
import { LoginComponent } from './_components/login/login.component';
import { HomeComponent } from './_components/home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthService} from './_service/auth.service';
import { AuthGuard } from './auth.guard';
import {RootGuard} from './root.guard'
import {TokenInterceptorService} from './_service/token-interceptor.service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { AboutComponent } from './_components/about/about.component';
import { PasswordRecoverComponent } from './_components/password-recover/password-recover.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    TimeoutDialog,
    AboutComponent,
    PasswordRecoverComponent
  ],
  imports: [
    BrowserAnimationsModule,
    MatButtonModule,
    BrowserModule,
    AppRoutingModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgIdleKeepaliveModule.forRoot()
  ],
  entryComponents:[TimeoutDialog],
  providers: [AuthService,AuthGuard,RootGuard,{provide:HTTP_INTERCEPTORS,useClass:TokenInterceptorService,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
