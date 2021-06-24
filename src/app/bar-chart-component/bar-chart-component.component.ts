
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { UserDataService } from '../Services/UserDataService';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-bar-chart-component',
  templateUrl: './bar-chart-component.component.html',
  styleUrls: ['./bar-chart-component.component.css']
})
export class BarChartComponentComponent implements OnInit ,OnDestroy{
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
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[];
  role;
  space;
  countSubsription:Subscription;
  constructor(public userDataService: UserDataService) {

  }

  ngOnDestroy(){
    this.countSubsription.unsubscribe();
  }

  ngOnInit() {
    this.countSubsription=this.userDataService.changedetectInRole.subscribe(data=>{
      this.role = JSON.parse(localStorage.getItem('role_id'));
      this.space = JSON.parse(localStorage.getItem('space'));

      // get Request Count for pending,open,close,Complete
       this.userDataService.getRequestCount(this.role, this.space)
      .subscribe(res => {
        let pending = res['req_stats'].Pending
        let close = res['req_stats'].Closed
        let open = res['req_stats'].Open
        let Completed = res['req_stats'].Completed
        console.log('Sub called!...');
        this.barChartData = [

          
          {
            backgroundColor: ['rgba(228, 231, 24, 0.315)', 'rgba(71, 99, 255, 0.301)', 'rgba(255, 99, 71, 0.233)','rgba(71, 255, 71, 0.226)'],
            borderColor: ['rgba(228, 231, 24, 0.315)', 'rgba(71, 99, 255, 0.301)', 'rgba(255, 99, 71, 0.233)','rgba(71, 255, 71, 0.226)'],
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
