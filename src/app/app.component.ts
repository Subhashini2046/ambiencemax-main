import { Component } from '@angular/core';
import { UserDataService } from './Services/UserDataService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(public UsrDataService: UserDataService) {
  //   if (this.UsrDataService.userId === null || this.UsrDataService.userId === undefined){
  //     console.log("asdfghj");
  //     console.log(this.UsrDataService.userId);
  //     if(JSON.parse(localStorage.getItem('userData'))) {
  //       this.UsrDataService.userId = JSON.parse(localStorage.getItem('userData')).userId;
  //     }
  //   }
  }
  title = 'AmbienceMax';
  logout() {
    this.UsrDataService.userId = null;
    this.UsrDataService.desiredRequests = [];
    this.UsrDataService.allRequests = [];
    this.UsrDataService.pendingRequests = [];
    this.UsrDataService.closedRequests = [];
    this.UsrDataService.openRequests = [];
    this.UsrDataService.toBeApproved = false;
    this.UsrDataService.message = '';
    this.UsrDataService.main = '';
    // this.UsrDataService.currUser = undefined;
  }

}
