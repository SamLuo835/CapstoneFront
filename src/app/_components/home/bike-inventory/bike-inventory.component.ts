import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../../_service/core.service';
import { DataShareService } from 'src/app/_service/data-share.service';
@Component({
  selector: 'app-bike-inventory',
  templateUrl: './bike-inventory.component.html',
  styleUrls: ['./bike-inventory.component.css'],
})
export class BikeInventoryComponent implements OnInit {

  constructor(private _core :CoreService,private _dataShare:DataShareService) { }

  bikes:any; 
  showSpinner : boolean = true

  ngOnInit() {
    if(this.bikes){
      this.showSpinner = false
    }
    else{
      this._core.getBikeList().subscribe(res=>{ this.showSpinner = false; this.bikes = res;this._dataShare.changeBikeList(this.bikes)})
     }
    }
  }

