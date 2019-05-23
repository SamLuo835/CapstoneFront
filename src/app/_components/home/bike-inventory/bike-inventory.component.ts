import { Component, OnInit, ViewEncapsulation,Inject } from '@angular/core';
import { CoreService } from '../../../_service/core.service';
import { DataShareService } from 'src/app/_service/data-share.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-bike-inventory',
  templateUrl: './bike-inventory.component.html',
  styleUrls: ['./bike-inventory.component.css'],
  encapsulation: ViewEncapsulation.None,
})


export class BikeInventoryComponent implements OnInit {
  constructor(private _core :CoreService,private _dataShare:DataShareService,private _modal: MatDialog) { }

  bikes:Array<any>; 
  showSpinner : boolean = true



  ngOnInit() {
    //check data share bikelist first
      if(this._dataShare.getBikeList().length == 0){
        this.getBikeList();
      }
      else{
        this.showSpinner = false;
        this.bikes = this._dataShare.getBikeList()
      }
    }



  

  getBikeList(){
    this._core.getBikeList().subscribe(res=>{
      this.showSpinner = false;
      this.bikes = JSON.parse(res) ;
    //TODO this need to be removed, as the back end need to return bike status as string 
      for(var i in this.bikes){
        this.bikes[i].available = this.bikes[i].available.toString()
      }
    //calling this will trigger the subscribe event that listening on bike list in other component
      this._dataShare.changeBikeList(this.bikes)
      })
    }


    openDialog(index,action): void { 
      const dialogRef = this._modal.open(BikeDialog, {
       data: {bike:this.bikes[index],action:action},
       height: '600px',
       width: '600px',
       autoFocus:false,
       disableClose: true
     });
     dialogRef.afterClosed().subscribe(result => {
       console.log('The dialog was closed');
     }); 
 }

  changeStatus(i){
      console.log(this.bikes[i]);
      //call back end service to change status of bike

      //this._dataShare.changeBikeList(this.bikes)
    }
  }



import { FileUploader } from 'ng2-file-upload';
  //dialog class
const URL = "http://luojianl.dev.fast.sheridanc.on.ca/capstone/assets/images/";
@Component({
  selector: 'BikeDialog',
  templateUrl: 'bike-inventory.component.dialog.html'
})
export class BikeDialog {
  public uploader:FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver:boolean = false;
 
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
 


  constructor(
    public dialogRef: MatDialogRef<BikeDialog>,@Inject(MAT_DIALOG_DATA) public data: any) {
    }

    
    ngOnInit(){
      console.log(this.data)
    }


    

    saveChanges(){
    }


  
    onClick(): void {
      this.dialogRef.close();
    }
}

