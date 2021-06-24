import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { UserDataService } from '../Services/UserDataService';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css'],
})
export class DoughnutChartComponent implements OnInit ,OnDestroy{
  space;
  role;
  doughnutChartLabels: Label[] = ['Pending','Open', 'Closed','Completed'];
  doughnutChartType: ChartType = 'doughnut';
  doughnutChartColors: any[]=[];
  doughnutChartData: MultiDataSet[];
  countSubsription:Subscription;
  constructor(public userDataService: UserDataService) { }
  ngOnDestroy(){
    this.countSubsription.unsubscribe();
  }

  ngOnInit() {
    this.countSubsription=  this.userDataService.changedetectInRole.subscribe(data=>{
      this.role = JSON.parse(localStorage.getItem('role_id'));
      this.space = JSON.parse(localStorage.getItem('space'));

      // get Request Count for pending,open,close,Complete
      this.userDataService.getRequestCount(this.role, this.space).subscribe((response: any) => {
      let Pending = response.req_stats.Pending;
      let Open = response.req_stats.Open;
      let Closed = response.req_stats.Closed;
      let Completed=response.req_stats.Completed;
      this.doughnutChartLabels;
      this.doughnutChartColors= 
[
    {
      backgroundColor: ['rgba(228, 231, 24, 0.315)', 'rgba(71, 99, 255, 0.301)', 'rgba(255, 99, 71, 0.233)','rgba(71, 255, 71, 0.226)'],
      borderColor: ['rgba(228, 231, 24, 0.315)', 'rgba(71, 99, 255, 0.301)', 'rgba(255, 99, 71, 0.233)','rgba(71, 255, 71, 0.226)'],
    }
]
      this.doughnutChartData = [
        [Pending,Open,Closed,Completed]
      ];
      this.doughnutChartType;
      
    });
  })
  }
}
