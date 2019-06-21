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
        this.bikes = JSON.parse(JSON.stringify(this._dataShare.getBikeList()));
      }
    }



  

  getBikeList(){
    this._core.getBikeList().subscribe(res=>{
      this.showSpinner = false;
      this.bikes = JSON.parse(res) ;
    //calling this will trigger the subscribe event that listening on bike list in other component
      this._dataShare.changeBikeList(JSON.parse(res))
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
      console.log(this._dataShare.getBikeList());
      console.log(this.bikes);
      //call back end service to change status of bike
      //call get bikes again to use the response bike list and pass down to changeBikeList (passing local bikelist will 
      //make data share bike list tie to local, making the next drop down selection alter the share bike list without 
      //service side operation.
      //this._dataShare.changeBikeList();
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
  constructor(
    public dialogRef: MatDialogRef<BikeDialog>,@Inject(MAT_DIALOG_DATA) public data: any, private _core :CoreService, private notification : NotifierService) {
    }

    ngOnInit(){
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {

        document.getElementById("header").style.height = "70px";

        document.getElementById("menuFlexBox").style.width = "100%";
        document.getElementById("menuFlexBox").style.flexDirection = "row";
        document.getElementById("menuFlexBox").style.top = "unset";
        document.getElementById("menuFlexBox").style.justifyContent = "space-between";


        document.getElementById("headerTitle").style.fontSize = "1.5em";
        document.getElementById("headerTitle").style.right = "unset";
        document.getElementById("headerTitle").style.padding = "25px 0 0 25px";
      
        document.getElementById("headerMenu").style.top = "unset";

        document.getElementById("headerLogo").style.display = "none";

        

      } else {
        document.getElementById("header").style.height = "200px";

        document.getElementById("menuFlexBox").style.width = "unset";
        document.getElementById("menuFlexBox").style.flexDirection = "column";
        document.getElementById("menuFlexBox").style.top = "40px";
        document.getElementById("menuFlexBox").style.justifyContent = "unset";


        document.getElementById("headerMenu").style.top = "20px";

        document.getElementById("headerTitle").style.right = "4%";
        document.getElementById("headerTitle").style.paddingTop = "unset";
        document.getElementById("headerTitle").style.fontSize = "3em";
       
        document.getElementById("headerLogo").style.display = "block";

      }
    }

    saveChanges(){
      this._core.editBike(this.bike).subscribe(res => {
        this.notification.notify('success', res.message);
      });
      // this.dialogRef.close({rentalId:this.data.rentalId,action:'change',comment:this.data.comment,dueDate:_moment(this.dueDate).format('YYYY-MM-DD')});
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

