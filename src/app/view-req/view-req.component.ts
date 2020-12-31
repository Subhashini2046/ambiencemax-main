import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { ReqSchema } from '../Services/ReqSchema';
import { MatSnackBar } from '@angular/material';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms';

@Component({
  selector: 'app-view-req',
  templateUrl: './view-req.component.html',
  styleUrls: ['./view-req.component.css']
})
export class ViewReqComponent implements OnInit {
  view: ReqSchema;
  public req_id;
  public req_title;
  public req_type;
  public req_budget;
  public req_date;
  public req_description;
  public req_initiator_id;
  public req_status;
  public role_name;
  public req_action;
  workflow;
  comment = '';
  Approvers = [];
  appExists = false;
  constructor(public userDataService: UserDataService , private router: Router,public snackBar: MatSnackBar,private _location: Location) {
    this.view = this.userDataService.viewReq;
    this.workflow=this.userDataService.RoleMap;
    if (this.userDataService.userRole !== null) {
      localStorage.setItem('viewReq', JSON.stringify(this.view));
      console.log(this.view);
    }
  }
  currReqApprovers = [];
  submitFeedback() {
    // this.userDataService.viewReq.comment.push(this.comment);
    // this.userDataService.viewReq.status = 'UnderNeg';
    // console.log(this.userDataService.viewReq.comment);
  }
  goToUpgrade() {

    this.router.navigate(['/dialogg', this.view.req_id]);
    console.log(this.view.req_id, 'In resend button');
  
  }
  onSubmit() {
    // console.log(this.currReqApprovers);
    // this.userDataService.viewReq.status = 'Pending';
    // console.log(this.userDataService.viewReq.status);
    // if (this.userDataService.currUser.designation === 'admin') {
    //   this.currReqApprovers.forEach( e => {
    //     this.userDataService.addApprovers(this.view, e );
    //   });
    // }
  }
  backClicked() {
    this._location.back();
    console.log( 'goBack()...' );
    // let main='Pending';
    //  this.router.navigate([`/dashboard/${main}`]);
    //   console.log("dashboard");
    
  }
  ngOnInit() {
    this.userDataService.toBeApproved=false;
    if ( this.userDataService.viewReq === null || this.userDataService.viewReq === undefined) {
      this.userDataService.viewReq = JSON.parse(localStorage.getItem('viewReq'));
      this.userDataService.toBeApproved = JSON.parse(localStorage.getItem('toBeApproved'));
      this.userDataService.userRole=JSON.parse(localStorage.getItem('userRole'));
      // console.log(JSON.parse(localStorage.getItem('toBeApproved')));
      console.log(this.userDataService.viewReq);
      this.view = this.userDataService.viewReq;
      this.workflow=this.userDataService.RoleMap;
      console.log(this.view);
      this.userDataService.message = JSON.parse(localStorage.getItem('message'));
      //this.userDataService.userRole = JSON.parse(localStorage.getItem('userData')).userRole;
      //console.log("Role",this.userDataService.RoleMap);
    }
    this.userDataService.getViewRequestData(this.userDataService.viewReq.req_id).subscribe((response:any)=>{
      this.req_id=response.req_data[0]['req_id'];
      this.req_title=response.req_data[0]['req_title'];
      this.req_type=response.req_data[0]['req_type'];
      this.req_initiator_id=response.req_data[0]['req_initiator_id'];
      this.req_date=response.req_data[0]['req_date'];
      this.req_budget=response.req_data[0]['req_budget'];
      this.req_description=response.req_data[0]['req_description'];
      this.req_status=response.req_data[0]['req_status'];
      this.role_name=response.role_name;
      this.req_action=response.req_action;
      //console.log(this.role_name);
    });
    console.log(localStorage);
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 3500,
      panelClass: ['simple-snack-bar']
    });
  }
}
