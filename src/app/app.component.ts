import { Component, NgZone, ViewEncapsulation, ViewChild } from '@angular/core';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AuthService} from '../app/_service/auth.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {DataShareService} from '../app/_service/data-share.service';
import {MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[Location],
  encapsulation: ViewEncapsulation.None,

})
export class AppComponent {
  title = 'Capstonefront';
  imgSrc='./assets/images/logo.png'
  lastPing?: Date = null;
  animation :boolean = false;
  @ViewChild(MatMenuTrigger) menu: MatMenuTrigger;

  ngOnInit() {
    window.addEventListener("scroll" , () => {
     
      if(this.menu != undefined){
        if(this.menu.menuOpen){
          this.menu.closeMenu();
        }
      }

      if (document.documentElement.scrollTop > 50) {
        this.animation = true;
      } else if( document.documentElement.scrollTop == 0 ){
        //start new if-block to reduce the unnecessary get class when the scroll event trigger
          if(document.getElementsByClassName('cdk-overlay-backdrop').length == 0 || (document.getElementsByClassName('cdk-overlay-transparent-backdrop').length > 0)){
            this.animation = false;
          }
        }
      

    });
  }


  eventFire(el,etype){
    if(el.fireEvent){
      el.fireEvent('on'+etype);
    }
    else{
      var evObj = document.createEvent('Events');
    }
      evObj.initEvent(etype,true,false);
      el.dispatchEvent(evObj);
  }

  getClass(path){
    return (this._location.path().substr(0, path.length) === path) ? 'active' : '';
  }

  goToPage(){
    this._dataShare.changeShowForm(false);
    this._dataShare.changeCustomerShowForm(false);
  }

  constructor(private idle: Idle, private keepalive: Keepalive, private _modal: MatDialog,public _auth :AuthService,private _location :Location,private _dataShare :DataShareService) {
     // sets an idle timeout of 5 seconds, for testing purposes.
     idle.setIdle(600);
     // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
     idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onTimeout.subscribe(() => {
      if(this._auth.loggedIn()){
        let overLayElements = document.getElementsByClassName('mat-button-wrapper')
        if(overLayElements.length != 0){
         if(overLayElements[overLayElements.length-1].innerHTML == 'Cancel'){
            this.eventFire(overLayElements[overLayElements.length-1],'click');
          }
        }
        this.openDialog();
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }
      else{
        this.reset();
      }
    });
   
    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
   
  }
  reset() {
    this.idle.watch();
  }
  
  openDialog(): void {
    const dialogRef = this._modal.open(TimeoutDialog, {
      height: '190px',
      width: '600px',
      autoFocus:false,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reset();
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'timeoutDialog',
  templateUrl: 'app.component.timeout.html',
})
export class TimeoutDialog {

  constructor(
    public dialogRef: MatDialogRef<TimeoutDialog>,private dialog:MatDialog,private _router :Router,private ngZone :NgZone,private _dataShare :DataShareService) {
    }
  onClick(): void {
    this.dialog.closeAll();
    this.dialogRef.close();

    this.ngZone.run(()=> {this._router.navigate(['/']);this._dataShare.changeShowForm(false);this._dataShare.changeCustomerShowForm(false);
  });
  }

}
