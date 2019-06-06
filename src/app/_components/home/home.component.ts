import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../_service/auth.service'
import { BikeDialog } from './bike-inventory/bike-inventory.component';
import { MatDialog } from '@angular/material';
import {TooltipPosition} from '@angular/material/tooltip';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  componentIndex;

  formDisplay:Boolean = false;

  position:TooltipPosition;
  
  constructor(private _auth :AuthService,private _modal: MatDialog) { }

  ngOnInit() {
    this.position = 'left';
  }

  logoutButton(event){
    this._auth.logoutUser();
  }

  receiveMessage($event){
    this.componentIndex = $event;
    }

    openDialog(): void { 
      const dialogRef = this._modal.open(BikeDialog, {
        data:{bike:{bikeState:'',id:null,imgPath:'',manufacturer:'',notes:'',productCode:'',serialNumber:''},action:'create'},
       height: '600px',
       width: '600px',
       autoFocus:false,
       disableClose: true
     });
     dialogRef.afterClosed().subscribe(result => {
       console.log('The dialog was closed');
     }); 
    }
  
}
