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
  searchType:String = 'ID';
  tableData :Object[];
  showSpinner : boolean = true;
  dataSource : MatTableDataSource<any>;
  displayedColumns: string[] = ['sheridanId', 'firstName', 'sheridanEmail','isBlackListed','more'];

  tableDetail:Object = {};

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  ngOnInit() {
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
              console.log(this.input.nativeElement.value)
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
                  this._core.testSearchCustomer().subscribe(res=>{
                    this.tableData = res['body'];
                    this.dataSource.paginator.pageIndex = 0;
                    this.dataSource = new MatTableDataSource(this.tableData)
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.paginator.pageIndex = 0;
                    this.dataSource.paginator.length = this.tableData.length;
                  })
                }
                this.$searching = false;
              },1500); ; 
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
        if(result['action'] != undefined){
          if(result['action'] == 'redirect'){
              this._dataShare.changeRedirectMessage({index:4,userId:result['userId']});
           }
          }
      }); 
    }

}





//dialog class
@Component({
  selector: 'UserDialog',
  templateUrl: 'user.component.dialog.html'
})
export class UserDialog {

  user:any;
  

  constructor(public dialogRef: MatDialogRef<UserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _core :CoreService, 
    private notification : NotifierService,private _dataShare:DataShareService) {
  }
  
  ngOnInit(){
    this.user = this.data.user;
  }

  saveChanges() {
  }

  

  showArchivedRecord(){
    this.dialogRef.close({action:'redirect',userId:this.user['sheridanId']});
  }

  changeImage() {
    // TODO: IMPLEMENT METHOD FOR CHOOSING AND UPLOADING IMAGE
  }

  onClick(): void {
    this.dialogRef.close({});
  }
}
