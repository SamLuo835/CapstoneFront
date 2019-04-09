import { Component, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { CoreService } from '../../../_service/core.service';
import {MatSort, MatTableDataSource,MatPaginator} from '@angular/material';

@Component({
  selector: 'app-archive-record',
  templateUrl: './archive-record.component.html',
  styleUrls: ['./archive-record.component.css']
})
export class ArchiveRecordComponent implements OnInit {

  constructor(private _core :CoreService) { }

  tableData :Object[];
  showSpinner : boolean = true;
  dataSource : MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'signOutDate', 'dueDate', 'returnedDate', 'rentalState'];

  tableDetail:Object = {};

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    setTimeout(()=>{this._core.archivedRentalsDataCall().subscribe(res=>{ 
      this.showSpinner = false;
      this.tableData = res;
      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })},3000);
  }

}
