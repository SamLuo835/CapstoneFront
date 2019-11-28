import { Component, OnInit, ViewChild, ViewEncapsulation, Inject, ElementRef } from '@angular/core';
import { CoreService } from '../../../_service/core.service';
import {MatSort, MatTableDataSource,MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { DataShareService } from 'src/app/_service/data-share.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {

  constructor(private _core :CoreService,private _modal: MatDialog,private _dataShare:DataShareService) { }

  $searching:boolean = false;
  //searchType:String = 'ID';
  tableData :Object[];
  showSpinner : boolean = true;
  dataSource : MatTableDataSource<any>;
  displayedColumns: string[] = ['sheridanId', 'firstName', 'sheridanEmail','blackListed','more'];

  tableDetail:Object = {};

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;



  ngOnInit() {
       this.getCustomers()
  }


  getCustomers(){
    this._core.customersDataCall().subscribe(res=>{ 
      this.showSpinner = false;
      this.tableData = res;
      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }


  ngAfterViewInit() {

    // server-side search
    fromEvent(this.input.nativeElement,'keyup')
        .pipe(
            debounceTime(800),
            distinctUntilChanged(),
            tap(() => {
              this.$searching = true;
              setTimeout(()=>{
                if(this.input.nativeElement.value == ""){
                  this._core.customersDataCall().subscribe(res=>{ 
                    this.tableData = res;
                    this.dataSource.paginator.pageIndex = 0;
                    this.dataSource = new MatTableDataSource(this.tableData)
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.paginator.pageIndex = 0;
                    this.dataSource.paginator.length = this.tableData.length;
                  })
                }
                else{
                  this._core.searchCustomer(this.input.nativeElement.value.trim()).subscribe(res=>{
                    this.tableData = res;
                    if(this.tableData == null){ this.tableData = []}
                    this.dataSource.paginator.pageIndex = 0;
                    this.dataSource = new MatTableDataSource(this.tableData)
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.paginator.pageIndex = 0;
                    this.dataSource.paginator.length = this.tableData.length;
                  })
                }
                this.$searching = false;
              },1500); 
            })
        )
        .subscribe();
    }



    openDialog(element): void { 
      let tempUser =  JSON.parse(JSON.stringify(element));
      const dialogRef = this._modal.open(UserDialog, {
        data: {user:tempUser},
        height: '600px',
        width: '600px',
        autoFocus:false,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result['waiverSign']){
          this.dataSource = undefined
          this.showSpinner = true
          this.getCustomers()
        }
        else
        if(result['action'] != undefined){
          if(result['action'] == 'redirect'){
              this._dataShare.changeRedirectMessage({index:4,userId:result['userId']});
           }
          else if(result['action'] == 'edit'){
              this.changeTableCell(result['user'])
          }
        }
      }); 
    }

    changeTableCell(result){
      for(let i in this.tableData){
        if(this.tableData[i]['sheridanId'] == result['sheridanId']){
          this.tableData[i]=result;
          this.dataSource = new MatTableDataSource(this.tableData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          break;
        }
      }
    }

}




import * as _moment from 'moment';

//dialog class
@Component({
  selector: 'UserDialog',
  templateUrl: 'user.component.dialog.html'
})
export class UserDialog {

  user:any;
  
  signedDate:string;
  expireDate:string;
  programEndDate:string;
  createdOn:string;
  toggleText:string;
  expireAlert:boolean;
  waiverSigned:boolean = false;

  categoryList = [];
  rowEditMode = [];
  total:number = 0;
  previousCategory:number = 0;
  hoverText:boolean = false;
  checkBoxState:boolean = false;
  currentIndex ;
  //convert to moment formatted date string
  signOutDate:string;
  dueDate:string;
  
  predefinedCat = [];

  constructor(public dialogRef: MatDialogRef<UserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _core :CoreService, 
    private notification : NotifierService,private _modal: MatDialog) {
  }
  
  ngOnInit(){    
    this.user = this.data.user;
    this.signedDate =  _moment(this.user.lastWaiverSignedAt).format();
    this.expireAlert = _moment(this.user.waiverExpirationDate).isBefore(new Date());
    this.expireDate = _moment(this.user.waiverExpirationDate).format();
    this.programEndDate = _moment(this.user.endOfProgram).format();
    this.createdOn = _moment(this.user.createdOn).format();
    if(this.user.blackListed)
      this.toggleText = "Unban Customer"
    else
    this.toggleText = "Ban Customer"
    this._core.getPayablesByCustomerId(this.user.sheridanId).subscribe(res => {
      for(var i in res) {
        this.total += res[i].value;
      }
      this.categoryList = JSON.parse(JSON.stringify(res));
    })
  }

  saveChanges() {
    //need to pass wavierSign boolean here too
    this.user.endOfProgram = _moment(new Date(this.programEndDate)).format("YYYY-MM-DD");
    this._core.editCustomer(this.user).subscribe(res=>{
      this.notification.notify('success',"Customer Edited");
      this.dialogRef.close({waiverSign:this.waiverSigned,action:'edit',user:this.user});
    })
  }

  toggleBanSwitch(){
    if(this.user.blackListed)
    this.toggleText = "Unban Customer"
    else
    this.toggleText = "Ban Customer"
  }

  openWaiverPage(){
    const waiverDialogRef = this._modal.open(WaiverDialog, {
      data: this.user,
      height: '700px',
      width: '1000px',
      autoFocus:false,
      disableClose: true
    });
    waiverDialogRef.afterClosed().subscribe(result => {
        if(result['signDate'] && result['expireDate']){
         this.waiverSigned = true;
         this.expireDate = _moment(result['expireDate']).format()
         this.signedDate = _moment(result['signDate']).format();
        }
    }); 
  }
  

  showArchivedRecord(){
    this.dialogRef.close({action:'redirect',userId:this.user['sheridanId']});
  }

  closeDialog(): void {
    this.dialogRef.close({waiverSign:this.waiverSigned});
  }
}



@Component({
  selector: 'WaiverDialog',
  templateUrl: 'user.component.waiverdialog.html'
})
export class WaiverDialog {

  sheridanId:string;

  source = 'dialog';

  formRequire:boolean;

  constructor(public dialogRef: MatDialogRef<WaiverDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _core :CoreService, 
    private notification : NotifierService,private _modal: MatDialog) {
  }

  closeDialog(){
    this.dialogRef.close({});

  }

  onClick(): void {
      this._core.waiverSign(this.sheridanId).subscribe(res=>{
      ///// resfresh the user after close the waiver dialog 
        this.notification.notify('success',"Waiver Signed");
        this.dialogRef.close({signDate:res['signdate'],expireDate:res['expirydate']});
      })
  }

  ngOnInit(){
      this.sheridanId = this.data.sheridanId
  }


  receiveMessage($event){
    this.formRequire = $event;
    }
}