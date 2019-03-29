import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../../_service/core.service';

@Component({
  selector: 'app-lock',
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.css']
})
export class LockComponent implements OnInit {

  constructor(private _core :CoreService) { }

  displayText : String; 
  showSpinner : boolean = true

  ngOnInit() {
    setTimeout(()=>{console.log("timeout");this._core.test().subscribe(res=>{ this.showSpinner = false; this.displayText=res['body']['text'] })},3000);
  }

}
