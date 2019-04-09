import { Component, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { CoreService } from '../../../_service/core.service';
import {MatSort, MatTableDataSource,MatPaginator} from '@angular/material';

@Component({
  selector: 'app-lock',
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.css']
})
export class LockComponent implements OnInit {

  dummyData: Object[] = [{id:"L001", status:"Available"},
                        {id:"L002", status:"Rented"},
                        {id:"L003", status:"Rented"},
                        {id:"L004", status:"Available"},
                        {id:"L005", status:"Key Lost"},
                        {id:"L006", status:"Lost"},
                        {id:"L007", status:"Rented"},
                        {id:"L008", status:"Available"},
                        {id:"L009", status:"Available"},];

  constructor(private _core :CoreService) { }

  tableData :Object[];
  showSpinner : boolean = true;
  dataSource : MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'status', 'manage'];

  tableDetail:Object = {};

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.showSpinner = false;
    this.tableData = this.dummyData;
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}
