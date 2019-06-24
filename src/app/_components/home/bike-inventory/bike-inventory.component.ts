import { Component, OnInit, ViewEncapsulation,Inject } from '@angular/core';
import { CoreService } from '../../../_service/core.service';
import { DataShareService } from 'src/app/_service/data-share.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-bike-inventory',
  templateUrl: './bike-inventory.component.html',
  styleUrls: ['./bike-inventory.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class BikeInventoryComponent implements OnInit {
  constructor(private _core :CoreService,private _dataShare:DataShareService,private _modal: MatDialog,private notification : NotifierService) { }

  bikes:Array<any>; 
  showSpinner : boolean = true

  ngOnInit() {
    //check data share bikelist first
    if(this._dataShare.getBikeList().length == 0){
      this.getBikeList();
    }
    else{
      this.showSpinner = false;
      this.bikes = JSON.parse(JSON.stringify(this._dataShare.getBikeList()));
    }
  }

  getBikeList(){
    this._core.getBikeList().subscribe(res=>{
      this.showSpinner = false;
      this.bikes = JSON.parse(res);
    //calling this will trigger the subscribe event that listening on bike list in other component
      this._dataShare.changeBikeList(JSON.parse(res));
    });
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
      if(result['action'] == "refresh"){
      this.bikes = JSON.parse(JSON.stringify(this._dataShare.getBikeList()));
      console.log(this.bikes);
      }
    }); 
  }

  changeStatus(i){
      console.log(this._dataShare.getBikeList());
      console.log(this.bikes);

      this._core.editBike(this.bikes[i]).subscribe(res => {
        this.notification.notify('success', res.message);
        this._core.getBikeList().subscribe(res=>{
          this._dataShare.changeBikeList(JSON.parse(res));
          }
        )
      });
    }
  }

//dialog class
@Component({
  selector: 'BikeDialog',
  templateUrl: 'bike-inventory.component.dialog.html'
})
export class BikeDialog {

  bike:any = this.data.bike;
  action:String = this.data.action;
  constructor(public dialogRef: MatDialogRef<BikeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _core :CoreService, 
    private notification : NotifierService,private _dataShare:DataShareService) {

    if(this.action == 'create') {
      this.bike.imgPath = '1.jpg'; // default image if new bike
    }
  }

  saveChanges() {
    this._core.editBike(this.bike).subscribe(res => {
      this.notification.notify('success', res.message);
      this._core.getBikeList().subscribe(res=>{
        this._dataShare.changeBikeList(JSON.parse(res));
        this.dialogRef.close({action:"refresh"});
        },error =>{this.dialogRef.close()});
    },error =>{this.dialogRef.close()});
  }

  addBike() {
    this.bike.bikeState = 'AVAILABLE'; // default state
    this._core.newBike(this.bike).subscribe(res => {
      this.notification.notify('success', res.message);
      this._core.getBikeList().subscribe(res=>{
        this._dataShare.changeBikeList(JSON.parse(res));
        this.dialogRef.close({action:"refresh"});
        },error =>{this.dialogRef.close()})
    },error =>{this.dialogRef.close()});
  }

  changeImage() {
    // TODO: IMPLEMENT METHOD FOR CHOOSING AND UPLOADING IMAGE
  }

  onClick(): void {
    this.dialogRef.close({action:'cancel'});
  }
}

  // TODO: IMPLEMENT UPLOAD IMAGE
// import { FileUploader } from 'ng2-file-upload';
//   //dialog class
// const URL = "http://luojianl.dev.fast.sheridanc.on.ca/capstone/assets/images/";
// @Component({
//   selector: 'BikeDialog',
//   templateUrl: 'bike-inventory.component.dialog.html'
// })
// export class BikeDialog {
//   public uploader:FileUploader = new FileUploader({url: URL});
//   public hasBaseDropZoneOver:boolean = false;
 
//   public fileOverBase(e:any):void {
//     this.hasBaseDropZoneOver = e;
//   }
 


//   constructor(
//     public dialogRef: MatDialogRef<BikeDialog>,@Inject(MAT_DIALOG_DATA) public data: any) {
//     }

    
//     ngOnInit(){
//       console.log(this.data)
//     }


    

//     saveChanges(){
//     }


  
//     onClick(): void {
//       this.dialogRef.close();
//     }
// }

