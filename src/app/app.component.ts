import { Component, NgZone } from '@angular/core';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AuthService} from '../app/_service/auth.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {DataShareService} from '../app/_service/data-share.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[Location]
})
export class AppComponent {
  title = 'Capstonefront';
  imgSrc='./assets/images/logo.png'
  lastPing?: Date = null;


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
