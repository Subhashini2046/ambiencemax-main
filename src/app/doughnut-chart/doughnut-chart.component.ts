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
  doughnutChartLabels: Label[] = ['Pending', 'Closed', 'Open','Completed'];
  doughnutChartType: ChartType = 'doughnut';
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
      this.doughnutChartData = [
        [Pending, Closed, Open,Completed]
      ];
      this.doughnutChartType;
    });
  })
  }
}
