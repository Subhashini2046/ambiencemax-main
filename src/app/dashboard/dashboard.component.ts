  import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
  import { UserDataService } from '../Services/UserDataService';
  import { RequestService,ReqStats } from'../Services/RequestService';
  import { MediaMatcher } from '@angular/cdk/layout';
  import { Subscription } from 'rxjs';
  import { Router } from '@angular/router';
  import { MatTableDataSource, MatPaginator } from '@angular/material'; 
  import { HttpClient } from '@angular/common/http';
  export interface Options {
    name: string;
    func: string;
  }
  @Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    providers:[RequestService]
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
    public userId;
    public userRole;

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
      public requestService: RequestService,
      changeDetectorRef: ChangeDetectorRef,
      private http: HttpClient,
      media: MediaMatcher,
      private router: Router
    ) {
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      // tslint:disable-next-line: deprecation
      this.mobileQuery.addListener(this._mobileQueryListener);
    }
    public dataSource = new MatTableDataSource(this.UsrDataService.desiredRequests);
    Request(type: string) {
      // const all = this.UsrDataService.fetchObservable();
      this.main = type;
      if (type === 'Pending') {
       // this.requestService.getPendingRequest(this.userId);
       // this.UsrDataService.desiredRequests = this.UsrDataService.pendingRequests;
        //this.requestService.getRequest(this.userId);
        // this.UsrDataService.fetchPendingRequest();
        // this.UsrDataService.fetchDesiredObservable().subscribe((e)=>{
        //   this.dataSource.data = e;
        // });
       // this.router.navigateByUrl('/dashboard/pending');
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
        //this.UsrDataService.desiredRequests = this.UsrDataService.closedRequests;
        this.router.navigate(['/dashboard/close']);
        console.log('Closed Called');
      } else if (type === 'open') {
        // this.UsrDataService.isPending = false;
       // this.UsrDataService.desiredRequests = this.UsrDataService.openRequests;
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
      this.userId = JSON.parse(localStorage.getItem('userId'));
      console.log(this.userId);
      this.userRole= JSON.parse(localStorage.getItem('userRole'));
      console.log(this.userRole);
    // let response:any=  this.requestService.getRequest(this.userId).subscribe((response:any)=>{
    //   this.Pending=response.req_stats.Pending,
    // this.All = response.req_stats.All;
    //   this.Open = response.req_stats.Open;
    //   this.Closed = response.req_stats.Closed;
     
    // });
      //    if (this.UsrDataService.userRole == null) {
      //   this.UsrDataService.reqStats = JSON.parse(localStorage.getItem('RqeuestState'));
      //   if (this.UsrDataService.reqStats !== null) {
      //     console.log('User Data Fetched from Local storage!');
      //     //this.UsrDataService.reqStats = this.UsrDataService.reqStats;
      //     // this.All = this.UsrDataService.reqStats.All;
      //     // this.Pending = this.UsrDataService.reqStats.Pending;
      //     // this.Closed = this.UsrDataService.reqStats.Closed;
      //     // this.Open = this.UsrDataService.reqStats.Open;
      //     //this.UsrDataService.hId = this.UsrDataService.Data.hId;
      //     let response:any=  this.requestService.getRequest(this.userId).subscribe((response:any)=>{
      //       this.Pending=response.req_stats.Pending,
      //     this.All = response.req_stats.All;
      //       this.Open = response.req_stats.Open;
      //       this.Closed = response.req_stats.Closed;
           
      //     });
      //   } else {
      //     console.log('No User in session!');
      //     this.router.navigateByUrl('/');
      //   }
      // }
      if (this.userRole != null) {
      let response:any=  this.requestService.getRequest(this.userId).subscribe((response:any)=>{
      this.Pending=response.req_stats.Pending,
    this.All = response.req_stats.All;
      this.Open = response.req_stats.Open;
      this.Closed = response.req_stats.Closed;
     
    });
  }
      // this.Pending = this.UsrDataService.reqStats.Pending;
      // this.All = this.UsrDataService.reqStats.All;
      // this.Open = this.UsrDataService.reqStats.Open;
      // this.Closed = this.UsrDataService.reqStats.Closed;
    // console.log('Sub called!');
    //   this.UsrDataService.fetchReqStat().subscribe((e) => {
    //     this.Pending = e.Pending;
    //     this.All = e.All;
    //     this.Open = e.Open;
    //     this.Closed = e.Closed;
    //     console.log('Sub called!!');
    //   });
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
