import { ReqSchema } from './../Services/ReqSchema';
import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-view-req',
  templateUrl: './view-req.component.html',
  styleUrls: ['./view-req.component.css']
})
export class ViewReqComponent implements OnInit {
  title = 'ambiencemax';
  comment = '';
  userRole = '';
  Approvers = [];
  appExists = false;
  me_type;
  req_id;
  budget_type;
  available_budget;
  balance_budget;
  consumed_budget;
  req_description='';
  req_swon;
  req_subject;
  req_type;
  resendToId;
  accessID;
  user_name;
  req_status;
  req_number;
  constructor(private actrouter: ActivatedRoute,public userDataService: UserDataService, private route: Router, private router: Router, public snackBar: MatSnackBar) {
  }
  ngOnInit() {
    this.actrouter.params.subscribe(params => {
      this.req_id = +params['id'];
      console.log('this.req_id ', this.req_id,this.resendToId);
    });
    this.user_name=JSON.parse(localStorage.getItem('user_name'));
    this.accessID=JSON.parse(localStorage.getItem('admin_access_id'));
    this.userDataService.getRequestDetail(this.req_id).subscribe((response: any) => {
      this.budget_type = response[0]["BudgetType"];
      this.me_type = response[0]["METype"];
      this.available_budget = response[0]["RequestAvailableBudget"];
      this.balance_budget = response[0]["RequestBalanceBudget"];
      this.consumed_budget = response[0]["RequestConsumedBudget"];
      this.req_description = response[0]["RequestDescription"];
      this.req_swon = response[0]["RequestSWON"];
      this.req_subject = response[0]["RequestSubject"];
      this.req_type = response[0]["RequestType"];
      this.req_status=response[0]["RequestStatus"];
      this.req_number=response[0]["RequestNumber"];
    });
  }
}
