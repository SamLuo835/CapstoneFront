import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, TimeoutDialog} from './app.component';
import { LoginComponent } from './_components/login/login.component';
import { HomeComponent } from './_components/home/home.component';
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
import { BikeInventoryComponent, BikeDialog } from './_components/home/bike-inventory/bike-inventory.component';
import { ActiveRecordComponent,DetailDialog } from './_components/home/active-record/active-record.component';
import { UserComponent, UserDialog, WaiverDialog } from './_components/home/user/user.component';
import { ArchiveRecordComponent,ArchivedDialog } from './_components/home/archive-record/archive-record.component';
import { RepairToolComponent } from './_components/home/repair-tool/repair-tool.component';
import { LockComponent, LockDialog } from './_components/home/lock/lock.component';
import {CoreService} from './_service/core.service';
import { NewRentalComponent } from './_components/home/new-rental/new-rental.component';
import {DataShareService} from './_service/data-share.service';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/';
import {MatPaginatorModule} from '@angular/material/';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ReportsComponent } from './_components/reports/reports.component';
import { NewCustomerComponent } from './_components/home/new-customer/new-customer.component';
import { FileUploadModule } from "ng2-file-upload";
import { NotifierModule } from 'angular-notifier';
import { UpperSectionComponentComponent } from './_components/reports/upper-section-component/upper-section-component.component';
import { Ng2OdometerModule } from 'ng2-odometer';
import { NgxMatDrpModule } from 'ngx-mat-daterange-picker';
import { LowerSectionComponentComponent } from './_components/reports/lower-section-component/lower-section-component.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatTabsModule} from '@angular/material/tabs';
import {MatStepperModule} from '@angular/material/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { WaiverComponent } from './_utility/waiver/waiver.component';
import { TermsConditionComponent } from './_utility/terms-condition/terms-condition.component';
import { BasketComponent, BasketDialog } from './_components/home/basket/basket.component'









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
    NewRentalComponent,
    DetailDialog,
    ReportsComponent,
    NewCustomerComponent,
    BikeDialog,
    UpperSectionComponentComponent,
    LowerSectionComponentComponent,
    UserDialog,
    WaiverDialog,
    LockDialog,
    BasketDialog,
    ArchivedDialog,
    WaiverComponent,
    TermsConditionComponent,
    BasketComponent
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
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    FileUploadModule,
    MatNativeDateModule,
    NgxMatDrpModule,
    Ng2OdometerModule.forRoot(),
    MatTooltipModule,
    MatMenuModule,
    DragDropModule,
    MatTabsModule,
    MatStepperModule,
    MatIconModule,
    MatSlideToggleModule,
    NotifierModule.withConfig( { position:{horizontal:{position:'right',distance:12},vertical:{position:'top',distance:5}},behaviour:{autoHide:3000},
    } )
  ],
  entryComponents:[TimeoutDialog,DetailDialog,BikeDialog,UserDialog,LockDialog,ArchivedDialog,WaiverDialog, BasketDialog],
  providers: [AuthService,CoreService,AuthGuard,RootGuard,{provide:HTTP_INTERCEPTORS,useClass:TokenInterceptorService,multi:true},DataShareService],
  bootstrap: [AppComponent]
})
export class AppModule { }
