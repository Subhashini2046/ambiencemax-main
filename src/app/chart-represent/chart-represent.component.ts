import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { RequestService} from'../Services/RequestService';
import { Label } from 'ng2-charts';
import { UserDataService } from '../Services/UserDataService';

@Component({
  selector: 'app-chart-represent',
  templateUrl: './chart-represent.component.html',
  styleUrls: ['./chart-represent.component.css'],
  providers:[RequestService]
})
export class ChartRepresentComponent implements OnInit {
  public Pending;
  public Closed;
  public Open;
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
  barChartLabels: Label[] = [ 'Pending' , 'Open', 'Closed'];
  barChartType: ChartType = 'horizontalBar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[];
  constructor(public userDataService: UserDataService,public requestService: RequestService) { }

  ngOnInit() {
    // this.userDataService.fetchReqStat().subscribe((e) => {
    //   this.Pending = e.Pending;
    //   this.Closed = e.Closed;
    //   this.Open = e.Open;
    //   console.log(this.Pending);
    // });
    // this.Pending = this.userDataService.reqStats.Pending;
    // // this.All = this.UsrDataService.reqStats.All;
    // this.Open = this.userDataService.reqStats.Open;
    // this.Closed = this.userDataService.reqStats.Closed;

    this.userId = JSON.parse(localStorage.getItem('userId'));
    console.log(this.userId);
    let response:any=  this.requestService.getRequest(this.userId).subscribe((response:any)=>{
     this.Pending=response.req_stats.Pending;
      this.Open = response.req_stats.Open;
      this.Closed = response.req_stats.Closed;
      localStorage.setItem('pendingReq', JSON.stringify(this.Pending));
      localStorage.setItem('OpenReq', JSON.stringify(this.Open));
      localStorage.setItem('CloseReq', JSON.stringify(this.Closed));
    });
    this.Pending = JSON.parse(localStorage.getItem('pendingReq'));
    this.Open = JSON.parse(localStorage.getItem('OpenReq'));
    this.Closed = JSON.parse(localStorage.getItem('CloseReq'));
    console.log(this.Pending);
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
        data: [this.Pending, this.Open, this.Closed],
        label: 'No Of Requests'
      }
    ];
    console.log('horizontalBar Called!');
    }
  }


