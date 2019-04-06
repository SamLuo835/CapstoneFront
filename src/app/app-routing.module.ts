import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './_components/login/login.component';
import { HomeComponent } from './_components/home/home.component';
import { AuthGuard } from './auth.guard';
import { RootGuard } from './root.guard';
import { AboutComponent } from './_components/about/about.component';
import { PasswordRecoverComponent } from './_components/password-recover/password-recover.component';
import { ReportsComponent } from './_components/reports/reports.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'/login',
    pathMatch:'full'
  },
  {path:'login',
   component:LoginComponent,
   canActivate:[RootGuard]
  },
  {
    path:'home',
    component: HomeComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'about',
    component:AboutComponent
  },
  {
    path:'report',
    component:ReportsComponent
  },
  {
    path:'password-recover',
    component:PasswordRecoverComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
