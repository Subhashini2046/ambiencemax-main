import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { format } from 'url';
import { ReqSchema } from '../Services/ReqSchema';
import {FormsModule} from "@angular/forms";
@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements OnInit {
  constructor( public UserDataService: UserDataService , private _snackBar: MatSnackBar,private router: Router) {

}
  Approvers = [];
  num = 0;
  //reqno = this.RequestsDataService.allRequests.length + 1;
  currReq: ReqSchema = {
    req_date: '' ,
    req_description: '',
    req_id: 0,
    req_initiator_id: this.UserDataService.userId,
    req_level: 1,
    req_status: 'Pending',
    req_title: '',
    req_type: '',
    w_id: 0,
    req_budget: 0
  };
  onSubmit() {
    this.openSnackBar('Request Submitted Successfully !');
    this.UserDataService.addRequest(this.currReq);
    this.currReq.req_initiator_id = this.UserDataService.userId;
    this.UserDataService.main = '';
    this.UserDataService.mainSub.next(this.UserDataService.main);
    this.router.navigateByUrl('/dashboard');
  }
  ngOnInit() {
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 3500,
      panelClass: ['simple-snack-bar']
    });
  }
}
