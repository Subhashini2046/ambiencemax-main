import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

export interface Options {
  name: string;
  func: string;
}
@Component({
  selector: 'app-navigation-home',
  templateUrl: './navigation-home.component.html',
  styleUrls: ['./navigation-home.component.css'],
})
export class NavigationHomeComponent implements OnInit, OnDestroy {
  main = this.UsrDataService.main;
  public Open;
  public All;
  public Pending;
  public Closed;
  public userId;
  public userRole;
  public w_id;
  public Completed;
  public UnreadStatuspending;
  public UnreadStatusAll;
  public UnreadStatusclosed;
  public UnreadStatuscompleted;
  public UnreadStatusopen;
  role;
  space;

  ChartType = 'bar';
  countSubsription: Subscription;
  constructor(public UsrDataService: UserDataService,private router: Router) {
  }
  //nagivate to following page
  Request(type: string) {
    this.main = type;
    if (type === 'Pending') {
      this.router.navigate(['AmbienceMax/pending']);
    } else if (type === 'all') {
      this.router.navigate(['AmbienceMax/all-request']);
    } else if (type === 'closed') {
      this.router.navigate(['AmbienceMax/close']);
    } else if (type === 'open') {
      this.router.navigate(['AmbienceMax/open']);
    } else if (type === 'complete') {
      this.router.navigate(['AmbienceMax/complete']);
    }
  }
  ngOnInit() {
    console.log('ngOnint Dashboard!');
    this.countSubsription = this.UsrDataService.changedetectInRole.subscribe(data => {
      this.role = JSON.parse(localStorage.getItem('role_id'));
      this.space = JSON.parse(localStorage.getItem('space'));

      //get Request count for open,pending,close and complete request.
      this.UsrDataService.getRequestCount(this.role, this.space).subscribe((res: any) => {
        this.Pending = res.req_stats.Pending;
        this.All = res.req_stats.All;
        this.Open = res.req_stats.Open;
        this.Closed = res.req_stats.Closed;
        this.Completed = res.req_stats.Completed;
        this.UnreadStatuspending = res["UnreadStatuspending"];
        this.UnreadStatusAll = res["UnreadStatusAll"];
        this.UnreadStatusclosed = res["UnreadStatusclosed"];
        this.UnreadStatuscompleted = res["UnreadStatuscompleted"];
        this.UnreadStatusopen = res["UnreadStatusopen"];
        if (this.UnreadStatuspending == null) { this.UnreadStatuspending = 0; }
        if (this.UnreadStatusAll == null) { this.UnreadStatusAll = 0; }
        if (this.UnreadStatusclosed == null) { this.UnreadStatusclosed = 0; }
        if (this.UnreadStatuscompleted == null) { this.UnreadStatuscompleted = 0; }
        if (this.UnreadStatusopen == null) { this.UnreadStatusopen = 0; }
      });
    });
  }
  ngOnDestroy(): void {
    this.countSubsription.unsubscribe();
  }

}
