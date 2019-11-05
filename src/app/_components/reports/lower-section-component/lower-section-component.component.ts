import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/_service/core.service';

@Component({
  selector: 'app-lower-section-component',
  templateUrl: './lower-section-component.component.html',
  styleUrls: ['./lower-section-component.component.css']
})
export class LowerSectionComponentComponent implements OnInit {

  constructor(private _core:CoreService) { }
  totalStudent:Number = 0;
  totalStaff:Number = 0;
  historicalAvg:Number = 0;
  
  ngOnInit() {
    setTimeout(()=>{this._core.getReportHistoricalData().subscribe(res => {
      this.totalStudent = res['numberOfStudents'];
      this.totalStaff = res['numberOfStaff'];
      this.historicalAvg = res['historicalRentDays'].toFixed(1);
    })},1000);
  }

  onGenerate() {
    this._core.getReportExcel().subscribe(fileData =>{
      
      const blob: any = new Blob([fileData], { 
        //type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
        type: 'application/vnd.ms-excel' }
      );
      let link = document.createElement("a");
      if (link.download !== undefined) {
        let url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "BikeHubReport.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

    })};

}
