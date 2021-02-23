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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  main = this.UsrDataService.main;
  public role_id;
  private reqSub: Subscription;
  Buttons: Options[] = [
    { name: 'All Requests', func: 'all' },
    { name: 'Pending Requests', func: 'Pending' },
    { name: 'Open Requests', func: 'open' },
    { name: 'Closed Requests', func: 'closed' },
    { name: 'Completed Requests', func: 'complete' },
  ];
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
      this.router.navigate(['/main/pending']);
    }
    else if (type === 'all') {
      this.router.navigate(['/main/allRequest']);
    }
     else if (type === 'closed') {
      this.router.navigate(['/main/close']);
      console.log('Closed Called');
    } else if (type === 'open') {
      this.router.navigate(['/main/open']);
    }else if (type === 'complete') {
      this.router.navigate(['/main/complete']);
    }
  }
  ngOnInit() {
    this.role_id = JSON.parse(localStorage.getItem('role_id'));
  console.log('user_id',this.role_id);
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  logout() {
    localStorage.clear();
    // this.UsrDataService.fetchedReqsUpdated.next(this.UsrDataService.fetchedReqs);
    this.UsrDataService.main = '';
  }
}
