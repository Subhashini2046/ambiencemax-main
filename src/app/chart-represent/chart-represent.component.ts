import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { UserDataService } from '../Services/UserDataService';

@Component({
  selector: 'app-chart-represent',
  templateUrl: './chart-represent.component.html',
  styleUrls: ['./chart-represent.component.css'],
})
export class ChartRepresentComponent implements OnInit ,OnDestroy{
  public Pending;
  public Closed;
  public Open;
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
  barChartLabels: Label[] = ['Pending', 'Open', 'Closed','Completed'];
  barChartType: ChartType = 'horizontalBar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[];
  space;
  role;
  countSubsription:Subscription;
  constructor(public userDataService: UserDataService) { }
  ngOnDestroy(){
    this.countSubsription.unsubscribe();
  }
  ngOnInit() {

    this.countSubsription= this.userDataService.changedetectInRole.subscribe(data=>{
      this.role = JSON.parse(localStorage.getItem('role_id'));
      this.space = JSON.parse(localStorage.getItem('space'));
      this.userDataService.getRequestCount(this.role, this.space)
      .subscribe(res => {
        let pending = res['req_stats'].Pending
        let close = res['req_stats'].Closed
        let open = res['req_stats'].Open
        let Completed = res['req_stats'].Completed
        console.log('Sub called!...');
        this.barChartData = [
          {
            backgroundColor: ['rgba(214, 245, 39, 0.507)', 'rgba(255, 159, 64, 0.2)', 'rgba(54, 162, 235, 0.2)'],
            borderColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(75, 192, 192)'],
            borderWidth: 1,
            barPercentage: 0.5,
            barThickness: 70,
            maxBarThickness: 80,
            minBarLength: 5,
            data: [pending, open, close,Completed],
            label: 'No Of Requests'
          }
        ];
   
      })
    })
  }
}


