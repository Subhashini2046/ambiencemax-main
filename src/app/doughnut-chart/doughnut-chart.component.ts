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
  doughnutChartLabels: Label[] = ['Open','Pending', 'Closed','Completed'];
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
      this.userDataService.getRequestCount(this.role, this.space,JSON.parse(localStorage.getItem('userId'))).subscribe((response: any) => {
      let Pending = response.req_stats.Pending;
      let Open = response.req_stats.Open;
      let Closed = response.req_stats.Closed;
      let Completed=response.req_stats.Completed;
      this.doughnutChartColors= 
[
    {
      backgroundColor: ['rgba(252, 255, 71, 0.555)', 'rgba(255, 99, 71, 0.582)','rgba(71, 99, 255, 0.479)', 'rgba(105, 233, 105, 0.534)'],
      borderColor: ['rgba(252, 255, 71, 0.555)', 'rgba(255, 99, 71, 0.582)','rgba(71, 99, 255, 0.479)', 'rgba(105, 233, 105, 0.534)'],
    }
]
      this.doughnutChartData = [
        [Open,Pending,Closed,Completed]
      ];
    });
  })
  }
}
