import { Component, OnInit, ViewChild, ViewEncapsulation, Inject, ElementRef } from '@angular/core';
import { CoreService } from '../../../_service/core.service';
import {MatSort, MatTableDataSource,MatPaginator,MatDialogRef,MAT_DIALOG_DATA,MatDialog} from '@angular/material';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-lock',
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.css']
})
export class LockComponent implements OnInit {

  constructor(private _core :CoreService,private _modal: MatDialog) {}

  tableData :Array<any>;
  showSpinner : boolean = true;
  dataSource : MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'status', 'manage'];
  tableDetail:Object = {};

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getLockList();
  }

  getLockList() {
    this._core.getLockList().subscribe(res => {
      this.showSpinner = false;
      this.tableData = JSON.parse(res);
      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  openDialog(element): void {
    console.log(element);
    const dialogRef = this._modal.open(LockDialog, {
      data: {lock: element},
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
  selector: 'LockDialog',
  templateUrl: 'lock.component.dialog.html'
})
export class LockDialog {
  lock: any;

  constructor(public dialogRef: MatDialogRef<LockDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _core: CoreService,
    private  notification: NotifierService) {}
  
  ngOnInit() {
    this.lock = this.data.lock;
  }

  saveChanges() {}

  onClick(): void {
    this.dialogRef.close({});
  }
}