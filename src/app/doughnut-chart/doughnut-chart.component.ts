import { Component } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { UserDataService } from '../Services/UserDataService';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css']
})
export class DoughnutChartComponent {
  public Pending = this.userDataService.reqStats.Pending;
  public Closed = this.userDataService.reqStats.Closed;
  public Open = this.userDataService.reqStats.Open;
  doughnutChartLabels: Label[] = [ 'Pending', 'Closed' , 'Open'];
  doughnutChartData: MultiDataSet = [
    [this.Pending , this.Closed , this.Open]
  ];
  doughnutChartType: ChartType = 'doughnut';
  constructor(public userDataService: UserDataService) {}
}
