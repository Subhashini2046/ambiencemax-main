import { Component,ChangeDetectorRef } from '@angular/core';
import { UserDataService } from './Services/UserDataService';
import { MediaMatcher } from '@angular/cdk/layout';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
export interface Options {
  name: string;
  func: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
  main = this.UsrDataService.main;
  mobileQuery: MediaQueryList;
  Buttons: Options[] = [
    { name: 'All Requests', func: 'all' },
    { name: 'Pending Requests', func: 'Pending' },
    { name: 'Open Requests', func: 'open' },
    { name: 'Closed Requests', func: 'closed' },
  ];
  private _mobileQueryListener: () => void;
  constructor(public UsrDataService: UserDataService,
    private breakpointObserver: BreakpointObserver,
      media: MediaMatcher,
      changeDetectorRef: ChangeDetectorRef,) {
  //   if (this.UsrDataService.userId === null || this.UsrDataService.userId === undefined){
  //     console.log("asdfghj");
  //     console.log(this.UsrDataService.userId);
  //     if(JSON.parse(localStorage.getItem('userData'))) {
  //       this.UsrDataService.userId = JSON.parse(localStorage.getItem('userData')).userId;
  //     }
  //   }
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  
  }

  title = 'AmbienceMax';
  logout() {
    this.UsrDataService.main = '';
    // this.UsrDataService.currUser = undefined;
  }
  ngOnInit() {
      
    this.main='';
    console.log('ngOnint Dashboard!');
    this.UsrDataService.mainObservable().subscribe( e => {
      this.main = e;
    });}
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
