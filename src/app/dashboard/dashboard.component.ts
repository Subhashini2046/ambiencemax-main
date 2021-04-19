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
  public space;
 public UnreadStatuspending;
 public UnreadStatusAll;
 public  UnreadStatusclosed;
 public UnreadStatuscompleted;
  public UnreadStatusopen;
  menus=[];
  userId;
  checkAdmin;
  // Buttons: Options[] = [
  //   { name: 'Pending Request', func: 'Pending' },
  //   { name: 'Open Request', func: 'open' },
  //   { name: 'Closed Request', func: 'closed' },
  //   { name: 'Completed Request', func: 'complete' },
  //   { name: 'All Request', func: 'all' },
  //   { name: 'Admin', func: 'admin' }
  // ];
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
  countSubsription:Subscription;
  // Request(type: string) {
  //   this.main = type;
    
  //   if (type === 'Pending') {
  //     this.router.navigate(['/AmbienceMax/pending']);
  //   }
  //   else if (type === 'all') {
  //     this.router.navigate(['/AmbienceMax/allRequest']);
  //   }
  //    else if (type === 'closed') {
  //     this.router.navigate(['/AmbienceMax/close']);
  //     console.log('Closed Called');
  //   } else if (type === 'open') {
  //     this.router.navigate(['/AmbienceMax/open']);
  //   }else if (type === 'complete') {
  //     this.router.navigate(['/AmbienceMax/complete']);
  //   }else if (type === 'admin') {
    
  //   }
  // }
  admin(){
     let userId=localStorage.getItem('userId');
     console.log("ff",userId);
     this.router.navigate(['/AmbienceMax/admin',userId]);
  }
  ngOnInit() {
    console.log("ng!!!!");
    this.userId=localStorage.getItem('userId');
    this.countSubsription=   this.UsrDataService.changedetectInRole.subscribe(data=>{
      this.role_id = localStorage.getItem('role_id');
      this.UsrDataService.getUsers(localStorage.getItem('userId')).subscribe(data=>{
      console.log(data);
      this.menus=JSON.parse(JSON.stringify(data));
    })
    this.role_id = localStorage.getItem('role_id');
    this.space= localStorage.getItem('space'); 

    //get Request Count for pending,open,close,Complete,unread status 
    this.UsrDataService.getRequestCount(this.role_id,this.space).subscribe((res)=>{
    this.UnreadStatuspending=res["UnreadStatuspending"];
    this.UnreadStatusAll=res["UnreadStatusAll"];
    this.UnreadStatusclosed=res["UnreadStatusclosed"];
    this.UnreadStatuscompleted=res["UnreadStatuscompleted"];
    this.UnreadStatusopen=res["UnreadStatusopen"];
    if(this.UnreadStatuspending==null){this.UnreadStatuspending=0;}
    if(this.UnreadStatusAll==null){this.UnreadStatusAll=0;}
    if(this.UnreadStatusclosed==null){this.UnreadStatusclosed=0;}
    if(this.UnreadStatuscompleted==null){this.UnreadStatuscompleted=0;}
    if(this.UnreadStatusopen==null){this.UnreadStatusopen=0;}
});
  });

  //check if admin has already access or not
  this.UsrDataService.adminCheck(this.userId).subscribe((data)=>{
    this.checkAdmin=data[0]['admAccess']
    });

  }
  ngOnDestroy(): void {
    this.countSubsription.unsubscribe();
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  logout() {

    localStorage.clear();
    this.UsrDataService.main = '';
    this.router.navigateByUrl('');
    return false;
  }

  // change dashboard data when user is switched 
  navigateToDashboard(role,space,id){
    console.log(id,"id");
    localStorage.setItem('role_id', JSON.stringify(role));
    localStorage.setItem('space', JSON.stringify(space));
    localStorage.setItem('admin_access_id', JSON.stringify(id));
    this.router.navigateByUrl('/AmbienceMax/dashboard');
    this.UsrDataService.changedetectInRole.next({role:role,space:space,id:id})
  }

  // for switch role
  getRoleName(name,roledesc){
    return roledesc+" | "+name
  }
}
