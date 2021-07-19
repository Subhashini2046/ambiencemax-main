import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { UserDataService } from '../Services/UserDataService';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-bar-chart-component',
  templateUrl: './bar-chart-component.component.html',
  styleUrls: ['./bar-chart-component.component.css']
})
export class BarChartComponentComponent implements OnInit, OnDestroy {
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
  barChartLabels: Label[] = ['Open','Pending', 'Closed', 'Completed'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[];
  role;
  space;
  countSubsription: Subscription;
  constructor(public userDataService: UserDataService) {

  }

  ngOnDestroy() {
    this.countSubsription.unsubscribe();
  }

  ngOnInit() {
    this.countSubsription = this.userDataService.changedetectInRole.subscribe(data => {
      this.role = JSON.parse(localStorage.getItem('role_id'));
      this.space =localStorage.getItem('space');

      // get Request Count for pending,open,close,Complete
      this.userDataService.getRequestCount(this.role, this.space,JSON.parse(localStorage.getItem('userId')))
        .subscribe(res => {
          let pending = res['req_stats'].Pending
          let close = res['req_stats'].Closed
          let open = res['req_stats'].Open
          let Completed = res['req_stats'].Completed
          console.log('Sub called!...');
          this.barChartData = [
            {
              backgroundColor: ['rgba(252, 255, 71, 0.555)', 'rgba(255, 99, 71, 0.582)','rgba(71, 99, 255, 0.479)', 'rgba(105, 233, 105, 0.534)'],
              borderColor: ['rgba(252, 255, 71, 0.555)', 'rgba(255, 99, 71, 0.582)','rgba(71, 99, 255, 0.479)', 'rgba(105, 233, 105, 0.534)'],
              borderWidth: 1,
              barPercentage: 0.5,
              barThickness: 70,
              maxBarThickness: 80,
              minBarLength: 5,
              data: [open,pending, close, Completed],
              label: 'No Of Requests'
            }
          ];

        })
    })
  }
}
