import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../_service/auth.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  compoentIndex;

  constructor(private _auth :AuthService) { }

  ngOnInit() {
  }

  logoutButton(event){
    this._auth.logoutUser();
  }

  receiveMessage($event){
    this.compoentIndex = $event;
    console.log(this.compoentIndex);
  }
  
}
