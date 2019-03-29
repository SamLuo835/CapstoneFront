import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../../_service/core.service';

@Component({
  selector: 'app-active-record',
  templateUrl: './active-record.component.html',
  styleUrls: ['./active-record.component.css']
})
export class ActiveRecordComponent implements OnInit {

  constructor(private _core :CoreService) { }

  displayText : String; 
  showSpinner : boolean = true

  ngOnInit() {
    setTimeout(()=>{console.log("timeout");this._core.test().subscribe(res=>{ this.showSpinner = false; this.displayText=res['body']['text'] })},3000);
  }

}
