import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';
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
  mobileQuery: MediaQueryList;
  main = this.UsrDataService.main;
  private reqSub: Subscription;
  public Open;
  public All;
  public Pending;
  public Closed;
  public userId;
  public userRole;
  public w_id;
  public Completed;
  role;
  space;

  ChartType = 'bar';
  Buttons: Options[] = [
    { name: 'All Requests', func: 'all' },
    { name: 'Pending Requests', func: 'Pending' },
    { name: 'Open Requests', func: 'open' },
    { name: 'Closed Requests', func: 'closed' },
    { name: 'Completed Requests', func: 'complete' }
  ];
  countSubsription:Subscription;
  private _mobileQueryListener: () => void;
  constructor(
    public UsrDataService: UserDataService,
    changeDetectorRef: ChangeDetectorRef,
    private http: HttpClient,
    media: MediaMatcher,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  Request(type: string) {
    this.main = type;
    if (type === 'Pending') {
      this.router.navigate(['main/pending']);
    } else if (type === 'all') {
      this.router.navigate(['main/all-request']);
    } else if (type === 'closed') {
      this.router.navigate(['main/close']);
    } else if (type === 'open') {
      this.router.navigate(['main/open']);
    }else if (type === 'complete') {
      this.router.navigate(['/main/complete']);
    }
  }
  ngOnInit() {
    console.log('ngOnint Dashboard!');
    this.countSubsription=   this.UsrDataService.changedetectInRole.subscribe(data=>{
      this.role = JSON.parse(localStorage.getItem('role_id'));
      this.space= JSON.parse(localStorage.getItem('space')); 
      this.UsrDataService.getRequestCount(this.role,this.space).subscribe((response:any)=>{
    this.Pending=response.req_stats.Pending,
    this.All = response.req_stats.All;
    this.Open = response.req_stats.Open;
    this.Closed = response.req_stats.Closed;
    this.Completed=response.req_stats.Completed;
   console.log(this.Completed,"llll");
  });
});
  }
  ngOnDestroy(): void {
    this.countSubsription.unsubscribe();
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  
}
