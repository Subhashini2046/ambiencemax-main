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
    public Open = this.UsrDataService.openRequests.length;
    public UnderNeg = this.UsrDataService.underNegRequests.length;
    public All;
    public Pending;
    public Closed;
    public userId;
    public userRole;
    public w_id;

    ChartType = 'bar';
    Buttons: Options[] = [
      { name: 'All Requests', func: 'all' },
      { name: 'Pending Requests', func: 'Pending' },
      { name: 'Open Requests', func: 'open' },
      { name: 'Closed Requests', func: 'closed' },
    ];
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
      this.mobileQuery.addListener(this._mobileQueryListener);
    }
    public dataSource = new MatTableDataSource(this.UsrDataService.desiredRequests);
    Request(type: string) {
      this.main = type;
      if (type === 'Pending') {
        this.router.navigate(['/dashboard/pending']);
        console.log('Pending Called');
      } else if (type === 'all') {
        this.router.navigate(['/dashboard/all-request']);
        console.log('All Called');
        
      } else if (type === 'closed') {
        this.router.navigate(['/dashboard/close']);
        console.log('Closed Called');
      } else if (type === 'open') {
        this.router.navigate(['/dashboard/open']);
        console.log('Open Called');
        
      }
      else if (type === 'viewStatus') {
        this.router.navigate(['/dashboard/status']);
        console.log('Open Called');
        
      }
      this.UsrDataService.desiredReqSub.next(this.UsrDataService.desiredRequests);
    }
    ngOnInit() {
      
      this.main='';
      console.log('ngOnint Dashboard!');
      this.UsrDataService.mainObservable().subscribe( e => {
        this.main = e;
      });
      this.userId = JSON.parse(localStorage.getItem('userId'));
      console.log('user_id',this.userId);
      this.userRole= JSON.parse(localStorage.getItem('userRole'));
      console.log('role_id',this.userRole);
      this.w_id= JSON.parse(localStorage.getItem('w_id'));
      console.log('w_id:',this.w_id);
      if (this.userRole != null) {
      let response:any=  this.requestService.getRequest(this.userId).subscribe((response:any)=>{
      this.Pending=response.req_stats.Pending,
      this.All = response.req_stats.All;
      this.Open = response.req_stats.Open;
      this.Closed = response.req_stats.Closed;
     
    });

  }
    }
    ngOnDestroy(): void {
      this.mobileQuery.removeListener(this._mobileQueryListener);
    }
    logout() {
      localStorage.clear();
      this.UsrDataService.userId = null;
      // this.UsrDataService.fetchedReqs = [];
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
      // this.UsrDataService.fetchedReqsUpdated.next(this.UsrDataService.fetchedReqs);
      this.UsrDataService.main = '';
      console.log(this.UsrDataService.pendingRequests);
    }
  }
