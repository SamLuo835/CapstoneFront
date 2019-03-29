import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../../_service/core.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private _core :CoreService) { }

  displayText : String; 
  showSpinner : boolean = true

  ngOnInit() {
    setTimeout(()=>{console.log("timeout");this._core.test().subscribe(res=>{ this.showSpinner = false; this.displayText=res['body']['text'] })},3000);
  }

}
