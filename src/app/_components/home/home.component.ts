import { Component, OnInit } from '@angular/core';
import { BikeDialog } from './bike-inventory/bike-inventory.component';
import { LockDialog } from './lock/lock.component';
import { BasketDialog } from './basket/basket.component';
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
  
  constructor(private _modal: MatDialog) { }

  ngOnInit() {
    this.position = 'left';
  }

  receiveMessage($event){
    this.componentIndex = $event;
    }

    openBikeDialog(): void { 
      const dialogRef = this._modal.open(BikeDialog, {
        data:{bike:{ state:'',name: '', imgPath:'',manufacturer:'',notes:'',productCode:'',serialNumber:''},action:'create'},
       height: '600px',
       width: '600px',
       autoFocus:false,
       disableClose: true
     });
     this.closeDialog(dialogRef); 
    }

    openLockDialog(): void {
      const dialogRef = this._modal.open(LockDialog, {
        data: {lock: { name: '', keyNum: '', state: '', notes: ''}, action: 'create'},
        height: '600px',
        width: '600px',
        autoFocus: false,
        disableClose: true
      });
     this.closeDialog(dialogRef);
    }

    openBasketDialog(): void {
      const dialogRef = this._modal.open(BasketDialog, {
        data: {basket: { name: '', state: '', notes: ''}, action: 'create'},
        height: '600px',
        width: '600px',
        autoFocus: false,
        disableClose: true
      });
     this.closeDialog(dialogRef);
    }
  
    closeDialog(dialogRef): void {
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }

}
