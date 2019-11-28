import { Component,EventEmitter, Input,OnInit,Output} from '@angular/core';
import { DataShareService } from 'src/app/_service/data-share.service';

@Component({
  selector: 'app-waiver',
  templateUrl: './waiver.component.html',
  styleUrls: ['./waiver.component.css']
})
export class WaiverComponent implements OnInit {
  waiverFormRequire:boolean;
  subscriptions = [];

  @Input() source:string ;
  @Input() customerName:string;
  @Output() messageEvent = new EventEmitter<boolean>();
  
  input:string;
  showError:boolean = false;

  constructor(private _dataShare:DataShareService) { }

  ngOnInit() {
    this.subscriptions.push(this._dataShare.currentWaiverRequire.subscribe(message => this.waiverFormRequire = message));
  }
  ngOnDestroy(){
    this.subscriptions.forEach( s => s.unsubscribe());
  }


  waiverCheck($event){
    //algo to check name match
    this.input = this.input.trim()
    console.log(this.input)
    console.log(this.customerName)
    if(this.input.replace(" ","").toLowerCase() === this.customerName.toLowerCase()){
      this.showError = false;
      this.waiverFormRequire = true
    }
    else{
      this.showError = true;
      this.waiverFormRequire = false
    }

    if(this.source != "dialog"){
      this._dataShare.changeWaiverFormRequire(this.waiverFormRequire);
    }
    else{
      this.messageEvent.emit(this.waiverFormRequire);
    }
  }

  getDate(){
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    var date = new Date()
    return date.getDate()+", "+ monthNames[date.getMonth()]+", "+ date.getFullYear(); 
  }

  getAcdemicYear(){
    var date = new Date()
    if(8 <= date.getMonth() &&  date.getMonth() <=11){
      return date.getFullYear()+1;
    }
    else return date.getFullYear();
  }

}