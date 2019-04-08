import { Component, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { CoreService } from '../../../_service/core.service';
import {MatSort, MatTableDataSource,MatPaginator} from '@angular/material';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private _core :CoreService) { }

  tableData :Object[];
  showSpinner : boolean = true;
  dataSource : MatTableDataSource<any>;
  displayedColumns: string[] = ['seridanId', 'name', 'sheridanEmail', 'type', 'isBlackListed'];

  tableDetail:Object = {};

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    setTimeout(()=>{this._core.customersDataCall().subscribe(res=>{ 
      this.showSpinner = false;
      this.tableData = res;
      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })},3000);
  }

}
