import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, TimeoutDialog} from './app.component';
import { LoginComponent } from './_components/login/login.component';
import { HomeComponent } from './_components/home/home.component';
import { Observable} from 'rxjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthService} from './_service/auth.service';
import { AuthGuard } from './auth.guard';
import {RootGuard} from './root.guard'
import {TokenInterceptorService} from './_service/token-interceptor.service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import { AboutComponent } from './_components/about/about.component';
import { PasswordRecoverComponent } from './_components/password-recover/password-recover.component';
import { LeftMenuComponent } from './_components/home/left-menu/left-menu.component';
import { BikeInventoryComponent } from './_components/home/bike-inventory/bike-inventory.component';
import { ActiveRecordComponent } from './_components/home/active-record/active-record.component';
import { UserComponent } from './_components/home/user/user.component';
import { ArchiveRecordComponent } from './_components/home/archive-record/archive-record.component';
import { RepairToolComponent } from './_components/home/repair-tool/repair-tool.component';
import { LockComponent } from './_components/home/lock/lock.component';
import { LoadingSpinnerComponent } from './_utility/loading-spinner/loading-spinner.component';
import {CoreService} from './_service/core.service';
import { NewRentalComponent } from './_components/home/new-rental/new-rental.component';
import {DataShareService} from './_service/data-share.service';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    TimeoutDialog,
    AboutComponent,
    PasswordRecoverComponent,
    LeftMenuComponent,
    BikeInventoryComponent,
    ActiveRecordComponent,
    UserComponent,
    ArchiveRecordComponent,
    RepairToolComponent,
    LockComponent,
    LoadingSpinnerComponent,
    NewRentalComponent
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
    NgIdleKeepaliveModule.forRoot(),
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  entryComponents:[TimeoutDialog],
  providers: [AuthService,CoreService,AuthGuard,RootGuard,{provide:HTTP_INTERCEPTORS,useClass:TokenInterceptorService,multi:true},MatNativeDateModule,DataShareService],
  bootstrap: [AppComponent]
})
export class AppModule { }
