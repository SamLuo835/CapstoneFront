import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../../_service/core.service';
@Component({
  selector: 'app-bike-inventory',
  templateUrl: './bike-inventory.component.html',
  styleUrls: ['./bike-inventory.component.css'],
})
export class BikeInventoryComponent implements OnInit {

  constructor(private _core :CoreService) { }

  bikes:Object; 
  showSpinner : boolean = true

  ngOnInit() {
    if(this.bikes){
      this.showSpinner = false
    }
    else{
    setTimeout(()=>{this._core.testBike().subscribe(res=>{ this.showSpinner = false; this.bikes=res['body']['bikes'] })},3000);
    }
  }

}
