  import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
  import { UserDataService } from '../Services/UserDataService';
  import { MediaMatcher } from '@angular/cdk/layout';
  import { Subscription } from 'rxjs';
  import { Router } from '@angular/router';
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
    private reqSub: Subscription;
    // public Cancelled = this.UsrDataService.cancelledRequests.length;
    public Open = this.UsrDataService.openRequests.length;
    public UnderNeg = this.UsrDataService.underNegRequests.length;
    public All;
    public Pending;
    public Closed;
    //public OpenReq;
    ChartType = 'bar';
    // Buttons:Options=[{ name: 'Open Requests', func: 'open' }];
    // Buttons1: Options[] = [
    //   // { name: 'All Requests', func: 'all' },
    //   // { name: 'Pending Requests', func: 'Pending' },
    // { name: 'Open Requests', func: 'open' },
    //   // { name: 'Closed Requests', func: 'closed' },
    // ];
    Buttons: Options[] = [
      { name: 'All Requests', func: 'all' },
      { name: 'Pending Requests', func: 'Pending' },
      { name: 'Open Requests', func: 'open' },
      { name: 'Closed Requests', func: 'closed' },
    ];
    // tslint:disable-next-line: variable-name
    private _mobileQueryListener: () => void;
    constructor(
      public UsrDataService: UserDataService,
      changeDetectorRef: ChangeDetectorRef,
      media: MediaMatcher,
      private router: Router
    ) {
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      // tslint:disable-next-line: deprecation
      this.mobileQuery.addListener(this._mobileQueryListener);
    }
    Request(type: string) {
      // const all = this.UsrDataService.fetchObservable();
      this.main = type;
      if (type === 'Pending') {
        this.UsrDataService.desiredRequests = this.UsrDataService.pendingRequests;
        this.router.navigate(['/dashboard/pending']);
        console.log('Pending Called');
        
      // this.UsrDataService.isPending = true;
      } else if (type === 'all') {
      // this.UsrDataService.isPending = false;
        this.UsrDataService.desiredRequests = this.UsrDataService.allRequests;
        this.router.navigate(['/dashboard/all-request']);
        console.log('All Called');
        
      } else if (type === 'closed') {
      // this.UsrDataService.isPending = false;
        this.UsrDataService.desiredRequests = this.UsrDataService.closedRequests;
        this.router.navigate(['/dashboard/close']);
        console.log('Closed Called');
      } else if (type === 'open') {
        // this.UsrDataService.isPending = false;
        this.UsrDataService.desiredRequests = this.UsrDataService.openRequests;
        this.router.navigate(['/dashboard/open']);
        console.log('Open Called');
        
      }
      this.UsrDataService.desiredReqSub.next(this.UsrDataService.desiredRequests);
      // console.log(this.UsrDataService.isPending);
    }
    ngOnInit() {
      this.main='';
      console.log('ngOnint Dashboard!');
      this.UsrDataService.mainObservable().subscribe( e => {
        this.main = e;
      });
      // if(this.UsrDataService.userId==1){
        
      // }
      if (this.UsrDataService.userRole == null || this.UsrDataService.allRequests.length === 0) {
        this.UsrDataService.Data = JSON.parse(localStorage.getItem('userData'));
        if (this.UsrDataService.Data !== null) {
          console.log('User Data Fetched from Local storage!');
          this.UsrDataService.pendingRequests = this.UsrDataService.Data.pendingReq;
          this.UsrDataService.closedRequests = this.UsrDataService.Data.closedReq;
          this.UsrDataService.openRequests = this.UsrDataService.Data.openReq;
          this.UsrDataService.email = this.UsrDataService.Data.email;
          this.UsrDataService.password = this.UsrDataService.Data.password;
          this.UsrDataService.allRequests = this.UsrDataService.Data.Requests;
          this.UsrDataService.userRole = this.UsrDataService.Data.userRole;
          this.UsrDataService.userId = this.UsrDataService.Data.userId;
          this.UsrDataService.reqStats = this.UsrDataService.Data.reqStats;
          this.All = this.UsrDataService.reqStats.All;
          this.Pending = this.UsrDataService.reqStats.Pending;
          this.Closed = this.UsrDataService.reqStats.Closed;
          this.Open = this.UsrDataService.reqStats.Open;
          this.UsrDataService.reqOffset = this.UsrDataService.Data.reqOffset;
          this.UsrDataService.hId = this.UsrDataService.Data.hId;
        } else {
          console.log('No User in session!');
          this.router.navigateByUrl('/');
        }
      }
      this.Pending = this.UsrDataService.reqStats.Pending;
      this.All = this.UsrDataService.reqStats.All;
      this.Open = this.UsrDataService.reqStats.Open;
      this.Closed = this.UsrDataService.reqStats.Closed;
      console.log('Sub called!');
      this.UsrDataService.fetchReqStat().subscribe((e) => {
        this.Pending = e.Pending;
        this.All = e.All;
        this.Open = e.Open;
        this.Closed = e.Closed;
        console.log('Sub called!');
      });
      // this.UsrDataService.NoOfReq('Pending');
      // this.Pending = this.UsrDataService.NoOfReq('Pending');
    }
    reqRefetch() {
      // this.UsrDataService.authenticateUser(this.UsrDataService.email, this.UsrDataService.password);
      this.UsrDataService.fetchLatestRequests();
    }
    ngOnDestroy(): void {
      this.mobileQuery.removeListener(this._mobileQueryListener);
      // this.reqSub.unsubscribe();
    }
    logout() {
      localStorage.clear();
      this.UsrDataService.userId = null;
      this.UsrDataService.fetchedReqs = [];
      this.UsrDataService.desiredRequests = [];
      this.UsrDataService.allRequests = [];
      this.UsrDataService.pendingRequests = [];
      this.UsrDataService.closedRequests = [];
      this.UsrDataService.openRequests = [];
      this.UsrDataService.toBeApproved = false;
      this.UsrDataService.message = '';
      this.UsrDataService.reqTypeData = {
        Pending: 0,
        Closed: 0,
        Open: 0
      };
      this.UsrDataService.fetchedReqsUpdated.next(this.UsrDataService.fetchedReqs);
      this.UsrDataService.main = '';
      console.log(this.UsrDataService.pendingRequests);
      // this.UsrDataService.currUser = undefined;
    }
  }
