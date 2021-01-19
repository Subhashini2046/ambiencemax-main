import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import {Location} from '@angular/common';
@Component({
  selector: 'app-update-request-form',
  templateUrl: './update-request-form.component.html',
  styleUrls: ['./update-request-form.component.css']
})
export class UpdateRequestFormComponent implements OnInit {
  checkoutForm;
  public userId;
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
  constructor(private _location: Location,public UserDataService: UserDataService,private formBuilder: FormBuilder,private router: Router,public userDataService: UserDataService,private _snackBar: MatSnackBar) {
    this.checkoutForm = this.formBuilder.group({
      RequestBudget: 0,
      RequesterId: 0,
      RequestTitle:'',
      Requestdes:''
    });
   }

  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('userId'));
    this.userDataService.getviewUpdateRequest(this.UserDataService.viewReq.req_id).subscribe((response:any)=>{
      this.req_id=response.req_data[0]['req_id'];
      this.req_title=response.req_data[0]['req_title'];
      this.req_type=response.req_data[0]['req_type'];
      this.req_initiator_id=response.req_data[0]['req_initiator_id'];
      this.req_date=response.req_data[0]['req_date'];
      this.req_budget=response.req_data[0]['req_budget'];
      this.req_description=response.req_data[0]['req_description'];
      this.req_status=response.req_data[0]['req_status'];
    });
  }

  onSubmit(RequestData) {
    this.openSnackBar('Request Updated Successfully !');
  
    this.UserDataService.addUpdateRequest(RequestData,this.UserDataService.viewReq.req_id);
    console.log("checkoutForm",RequestData);
    this.checkoutForm.reset();
    this.router.navigateByUrl('dashboard/open');
    
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 3500,
      panelClass: ['simple-snack-bar']
    });
  }
  
  backClicked() {
    this.router.navigateByUrl('dashboard/open');
    // this._location.back();
    console.log( 'goBack()...' );
  
  }
}
