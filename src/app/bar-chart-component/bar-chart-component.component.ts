
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { RequestService, ReqStats } from '../Services/RequestService';
import { Label } from 'ng2-charts';
import { UserDataService } from '../Services/UserDataService';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-bar-chart-component',
  templateUrl: './bar-chart-component.component.html',
  styleUrls: ['./bar-chart-component.component.css'],
  providers: [RequestService]
})
export class BarChartComponentComponent implements OnInit {

  public userId;
  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };
  barChartLabels: Label[] = ['Pending', 'Open', 'Closed'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[];
  public ReqStats: ReqStats;
  constructor(public userDataService: UserDataService, public requestService: RequestService) {

  }
  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('userId'));
    console.log(this.userId);
    this.requestService.getBar(this.userId)
      .subscribe(res => {
        let pending = res['req_stats'].Pending
        let close = res['req_stats'].Closed
        let open = res['req_stats'].Open
        console.log('Sub called!...');
        this.barChartData = [

          {
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(54, 162, 235, 0.2)'],
            borderColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(75, 192, 192)'],
            borderWidth: 1,
            barPercentage: 0.5,
            barThickness: 70,
            maxBarThickness: 80,
            minBarLength: 5,
            data: [pending, open, close],
            label: 'No Of Requests'
          }
        ];
        console.log('bar Called!');
      })
  }
}
