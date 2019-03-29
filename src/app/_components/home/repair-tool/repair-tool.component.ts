import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../../_service/core.service';

@Component({
  selector: 'app-repair-tool',
  templateUrl: './repair-tool.component.html',
  styleUrls: ['./repair-tool.component.css']
})
export class RepairToolComponent implements OnInit {

  constructor(private _core :CoreService) { }

  displayText : String; 
  showSpinner : boolean = true

  ngOnInit() {
    setTimeout(()=>{console.log("timeout");this._core.test().subscribe(res=>{ this.showSpinner = false; this.displayText=res['body']['text'] })},3000);
  }

}
