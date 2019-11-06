import { Component, OnInit, ViewChild, ViewEncapsulation, Inject, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CoreService } from '../../../_service/core.service';
import {MatSort, MatTableDataSource,MatPaginator,MatDialogRef,MAT_DIALOG_DATA,MatDialog} from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { DataShareService } from 'src/app/_service/data-share.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  constructor(private _core :CoreService,private _modal: MatDialog, private _dataShare:DataShareService) { }

  tableData : Array<any>;
  showSpinner : boolean = true;
  dataSource : MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'state', 'manage'];
  tableDetail:Object = {};

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  ngOnInit() {
    this.getBasketList();
    var basketSubject = this._dataShare.currentBasketList;
    basketSubject.subscribe(value => {
      this.refreshTable(value);
    });
  }

  getBasketList() {
    this._core.getBasketList().subscribe(res => {
      this.refreshTable(res);
    });
  }

  refreshTable(data:any) {
    this.showSpinner = false;
    if (typeof data == 'string') 
      this.tableData = JSON.parse(data);
    else
      this.tableData = data;
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  openDialog(element, action): void {
    const dialogRef = this._modal.open(BasketDialog, {
      data: {basket: element, action: action},
      height: '600px',
      width: '600px',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res['action'] != undefined) {
        if (res['action'] == 'redirect') {
          console.log('Changed succesfully');
        }
      }
    })
  }

}

//dialog class
@Component({
  selector: 'BasketDialog',
  templateUrl: 'basket.component.dialog.html'
})
export class BasketDialog {
  basket: any;
  action:String = this.data.action;

  constructor(public dialogRef: MatDialogRef<BasketDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _core: CoreService,
    private  notification: NotifierService,private _dataShare:DataShareService) {}
  
  ngOnInit() {
    this.basket = this.data.basket;
    // by default, state is set to AVAILABLE (for adding new baskets)
    if (this.basket.state === null || this.basket.state === "") {
      this.basket.state = "AVAILABLE";
    }
  }

  saveChanges() {
    this._core.editBasket(this.basket).subscribe(res => {
      this.notification.notify('success', res.message);
      this._core.getBasketList().subscribe(res => {
        this._dataShare.changeBasketList(JSON.parse(res))
      })
    }, error => {});
  }

  onClick(): void {
    this.dialogRef.close({});
  }

  addBasket() {
    this._core.newBasket(this.basket).subscribe(res => {
      this.notification.notify('success', res.message);
      this._core.getBasketList().subscribe(res=>{
        this._dataShare.changeBasketList(JSON.parse(res));
        },error =>{})
    },error =>{});
  }
}