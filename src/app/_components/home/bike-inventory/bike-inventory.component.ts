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

  bikes:Array<any>; 
  showSpinner : boolean = true

  ngOnInit() {
    //check data share bikelist first
      if(this._dataShare.getBikeList().length == 0){
        this.getBikeList();
      }
      else{
        this.showSpinner = false;
        this.bikes = this._dataShare.getBikeList()
      }
    }



  getBikeList(){
    this._core.getBikeList().subscribe(res=>{
      this.showSpinner = false;
      this.bikes = JSON.parse(res) ;
      //calling this will trigger the subscribe event that listening on bike list in other component
      this._dataShare.changeBikeList(this.bikes)})
    }
  }

