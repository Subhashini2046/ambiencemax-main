import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import {Location} from '@angular/common';
@Component({
  selector: 'app-view-status',
  templateUrl: './view-status.component.html',
  styleUrls: ['./view-status.component.css']
})
export class ViewStatusComponent implements OnInit {
  //len = this.UsrDataService.viewReq.ReqApprovers.length;
  constructor(public UsrDataService: UserDataService,private _location: Location) {
    //console.log(this.UsrDataService.viewReq.ReqApprovers);
   }

   backClicked() {
    this._location.back();
    console.log( 'goBack()...' );
    // let main='Pending';
    //  this.router.navigate([`/dashboard/${main}`]);
    //   console.log("dashboard");
    
  }
  ngOnInit() {
  }

}
