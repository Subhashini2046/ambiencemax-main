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
  public UnreadStatusclosed;
  public UnreadStatuscompleted;
  public UnreadStatusopen;
  menus:any = [];
  userId;
  checkAdmin;
  flag=0;
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
  countSubsription: Subscription;
  admin() {
    let userId = localStorage.getItem('userId');
    this.router.navigate(['/AmbienceMax/admin', userId]);
  }
  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.countSubsription = this.UsrDataService.changedetectInRole.subscribe(data => {
      this.role_id = localStorage.getItem('role_id');
      this.UsrDataService.getUsers(localStorage.getItem('userId')).subscribe(response => {
        this.menus = JSON.parse(JSON.stringify(response));
        console.log(this.menus);
      })
      this.role_id = localStorage.getItem('role_id');
      this.space = localStorage.getItem('space');

      //get Request Count for pending,open,close,Complete,unread status 
      this.UsrDataService.getRequestCount(this.role_id, this.space,JSON.parse(localStorage.getItem('userId'))).subscribe((res) => {
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

    //check if admin has already access or not
    this.UsrDataService.adminCheck(this.userId).subscribe((data) => {
      this.checkAdmin = data[0]['admAccess']
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
  navigateToDashboard(role, space, id) {
    localStorage.setItem('role_id', JSON.stringify(role));
    localStorage.setItem('space', JSON.stringify(space));
    localStorage.setItem('admin_access_id', JSON.stringify(id));
    this.router.navigateByUrl('/AmbienceMax/dashboard');
    this.UsrDataService.changedetectInRole.next({ role: role, space: space, id: id })
  }

  // for switch role
  getRoleName(name, roledesc) {
    if(name!='All Request'){
    return roledesc + " | " + name}
    else{
      return name;}
  }
}
