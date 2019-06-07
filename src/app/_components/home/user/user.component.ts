import { Component, OnInit, ViewChild, ViewEncapsulation, Inject, ElementRef } from '@angular/core';
import { CoreService } from '../../../_service/core.service';
import {MatSort, MatTableDataSource,MatPaginator} from '@angular/material';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {

  constructor(private _core :CoreService) { }

  $searching:boolean = false;
  searchType:String = 'name';
  tableData :Object[];
  showSpinner : boolean = true;
  dataSource : MatTableDataSource<any>;
  displayedColumns: string[] = ['sheridanId', 'firstName', 'sheridanEmail', 'type', 'isBlackListed'];

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
              this.$searching = true;
              setTimeout(()=>{
                this.dataSource = new MatTableDataSource([]);
                this.paginator.pageIndex = 0;
                this.paginator.length = 1;//size of return json
                this.$searching = false;
                console.log(this.input.nativeElement.value)
              },1500); ; 
            })
        )
        .subscribe();
    }

}
