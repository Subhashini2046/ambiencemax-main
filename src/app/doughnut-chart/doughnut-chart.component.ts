import { Component, OnInit } from '@angular/core';
import { RequestService} from'../Services/RequestService';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { UserDataService } from '../Services/UserDataService';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css'],
  providers:[RequestService]
})
export class DoughnutChartComponent implements OnInit {
  public Pending;
  public Closed;
  public Open;
  public userId;
  doughnutChartLabels: Label[] = [ 'Pending', 'Closed' , 'Open'];
  doughnutChartType: ChartType = 'doughnut';
  doughnutChartData: MultiDataSet[];
  constructor(public userDataService: UserDataService,public requestService: RequestService) { }
  ngOnInit() {
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
  this.doughnutChartLabels;
  this.doughnutChartData = [
    [this.Pending , this.Closed , this.Open]
  ];
  this.doughnutChartType;
  }
  // public Pending = this.userDataService.reqStats.Pending;
  // public Closed = this.userDataService.reqStats.Closed;
  // public Open = this.userDataService.reqStats.Open;
  // doughnutChartLabels: Label[] = [ 'Pending', 'Closed' , 'Open'];
  // doughnutChartData: MultiDataSet = [
  //   [this.Pending , this.Closed , this.Open]
  // ];
  // doughnutChartType: ChartType = 'doughnut';
  // constructor(public userDataService: UserDataService) {}
}
