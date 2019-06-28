import { Component, OnInit, ViewEncapsulation,Inject, ViewChild } from '@angular/core';
import { CoreService } from '../../../_service/core.service';
import { DataShareService } from 'src/app/_service/data-share.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { NotifierService } from 'angular-notifier';
import {
  CdkDrag,
  CdkDropList, CdkDropListGroup,
  moveItemInArray,
  CdkDragMove
} from "@angular/cdk/drag-drop";
import { ViewportRuler } from '@angular/cdk/overlay';


@Component({
  selector: 'app-bike-inventory',
  templateUrl: './bike-inventory.component.html',
  styleUrls: ['./bike-inventory.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BikeInventoryComponent implements OnInit {
  constructor(private viewportRuler: ViewportRuler,private _core :CoreService,private _dataShare:DataShareService,private _modal: MatDialog,private notification : NotifierService) {
    this.target = null;
    this.source = null;
   }

  bikes:Array<any>; 
  showSpinner : boolean = true
  subscriptions = [];
  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public dragIndex: number;
  public activeContainer;
  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder: CdkDropList;



  ngAfterViewInit() {
    let phElement = this.placeholder.element.nativeElement;

    phElement.style.display = 'none';
    phElement.parentNode.removeChild(phElement);
  }
  
  ngOnDestroy(){
    this.subscriptions.forEach( s => s.unsubscribe());
  }

  dragMoved(e: CdkDragMove) {
    let point = this.getPointerPositionOnPage(e.event);

    this.listGroup._items.forEach(dropList => {
      if (__isInsideDropListClientRect(dropList, point.x, point.y)) {
        this.activeContainer = dropList;
        return;
      }
    });
  }

  dropListDropped() {
    if (!this.target)
      return;

    let phElement = this.placeholder.element.nativeElement;
    let parent = phElement.parentElement;

    phElement.style.display = 'none';

    parent.removeChild(phElement);
    parent.appendChild(phElement);
    parent.insertBefore(this.source.element.nativeElement, parent.children[this.sourceIndex]);

    this.target = null;
    this.source = null;

    if (this.sourceIndex != this.targetIndex)
      moveItemInArray(this.bikes, this.sourceIndex, this.targetIndex);
      this._dataShare.changeBikeList(this.bikes);
      //TODO Call web service to upload the sequence 
  }

  dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    if (drop == this.placeholder)
      return true;

    if (drop != this.activeContainer)
      return false;

    let phElement = this.placeholder.element.nativeElement;
    let sourceElement = drag.dropContainer.element.nativeElement;
    let dropElement = drop.element.nativeElement;

    let dragIndex = __indexOf(dropElement.parentElement.children, (this.source ? phElement : sourceElement));
    let dropIndex = __indexOf(dropElement.parentElement.children, dropElement);

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = sourceElement.clientWidth + 'px';
      phElement.style.height = sourceElement.clientHeight + 'px';
      
      sourceElement.parentElement.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = '';
    dropElement.parentElement.insertBefore(phElement, (dropIndex > dragIndex 
      ? dropElement.nextSibling : dropElement));

    this.placeholder.enter(drag, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);
    return false;
  }
  
  /** Determines the point of the page that was touched by the user. */
  getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
    // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
    const point = __isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
        const scrollPosition = this.viewportRuler.getViewportScrollPosition();

        return {
            x: point.pageX - scrollPosition.left,
            y: point.pageY - scrollPosition.top
        };
    }
 

  ngOnInit() {
    //check data share bikelist first
    if(this._dataShare.getBikeList().length == 0){
      this.getBikeList();
    }
    else{
      this.showSpinner = false;
      this.bikes = JSON.parse(JSON.stringify(this._dataShare.getBikeList()));
    }
    this.subscriptions.push(this._dataShare.currentBikeList.subscribe(message =>{ this.bikes = JSON.parse(JSON.stringify(message))}));

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
      if(result['action'] != undefined){
      if(result['action'] == 'redirect'){
          this._dataShare.changeRedirectMessage({index:4,bikeId:result['bikeId']});
       }
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

  function __indexOf(collection, node) {
    return Array.prototype.indexOf.call(collection, node);
  };
  
  /** Determines whether an event is a touch event. */
  function __isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
    return event.type.startsWith('touch');
  }
  
  function __isInsideDropListClientRect(dropList: CdkDropList, x: number, y: number) {
    const {top, bottom, left, right} = dropList.element.nativeElement.getBoundingClientRect();
    return y >= top && y <= bottom && x >= left && x <= right; 
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
        },error =>{});
    },error =>{});
  }

  addBike() {
    this.bike.bikeState = 'AVAILABLE'; // default state
    this._core.newBike(this.bike).subscribe(res => {
      this.notification.notify('success', res.message);
      this._core.getBikeList().subscribe(res=>{
        this._dataShare.changeBikeList(JSON.parse(res));
        },error =>{})
    },error =>{});
  }

  showArchivedRecord(){
    this.dialogRef.close({action:'redirect',bikeId:this.bike['id']});
  }

  changeImage() {
    // TODO: IMPLEMENT METHOD FOR CHOOSING AND UPLOADING IMAGE
  }

  onClick(): void {
    this.dialogRef.close({});
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

