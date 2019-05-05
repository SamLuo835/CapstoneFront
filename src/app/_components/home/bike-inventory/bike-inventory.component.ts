import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../../_service/core.service';
import { DataShareService } from 'src/app/_service/data-share.service';

@Component({
  selector: 'app-bike-inventory',
  templateUrl: './bike-inventory.component.html',
  styleUrls: ['./bike-inventory.component.css'],
  encapsulation: ViewEncapsulation.None,
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
    //TODO this need to be removed, as the back end need to return bike status as string 
      for(var i in this.bikes){
        this.bikes[i].available = this.bikes[i].available.toString()
      }
    //calling this will trigger the subscribe event that listening on bike list in other component
      this._dataShare.changeBikeList(this.bikes)
      console.log(this.bikes)
    })

     
    }


  changeStatus(i){
      console.log(this.bikes[i]);
      //call back end service to change status of bike

      //this._dataShare.changeBikeList(this.bikes)
    }
  }

