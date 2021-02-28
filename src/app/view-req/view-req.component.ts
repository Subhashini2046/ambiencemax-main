import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import * as FileSaver from 'file-saver';
// declare var require: any
// const FileSaver = require('file-saver');
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
  req_description = '';
  public filename;
  req_swon;
  req_subject;
  req_type;
  resendToId;
  accessID;
  user_name;
  req_status;
  req_number;
  boqDescription: "";
  boqEstimatedCost: number;
  boqEstimatedTime: "";
  filepnc: any[] = [];
  public boqDescription1: "";
  public boqEstimatedCost1: number;
  boqEstimatedTime1: "";
  // for PNC form
  allocatedDays;
  allocationStartDate = "";
  actualCost;
  allocateStartDate;
  pncurl = "";
  allocatedSpoc = "";
  role_id;
  constructor(private actrouter: ActivatedRoute, public userDataService: UserDataService, private route: Router, private router: Router, public snackBar: MatSnackBar) {
  }
  ngOnInit() {
    this.actrouter.params.subscribe(params => {
      this.req_id = +params['id'];
      console.log('this.req_id ', this.req_id, this.resendToId);
    });
    this.userDataService.check_asRead(this.req_id).subscribe((response: any) => {
      console.log(response,"check_asRead");
    });
    this.user_name = JSON.parse(localStorage.getItem('user_name'));
    this.accessID = JSON.parse(localStorage.getItem('admin_access_id'));
    this.role_id = JSON.parse(localStorage.getItem('role_id'));
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
      this.req_status = response[0]["RequestStatus"];
      this.req_number = response[0]["RequestNumber"];
      this.boqDescription = response[0]["BOQDescription"];
      this.boqEstimatedCost = response[0]["BOQEstimatedCost"];
      this.boqEstimatedTime = response[0]["BOQEstimatedTime"];
      this.allocatedDays = response[0]["AllocatedDays"];
      this.allocationStartDate = response[0]["AllocationStartDate"];
      this.actualCost = response[0]["ActualCost"];
      this.pncurl = response[0]["PNCUrl"];
      if(this.pncurl!=null){
      this.filename = this.pncurl.replace(/^.*[\\\/]/, '');}
      console.log("this.pncurl", this.filename);
    });
  }
  returnBlob(res): Blob {
    console.log('file downloaded');
    return new Blob([res], { type: 'pdf' });
  }
  download() {
    this.userDataService.downloadFile(this.filename).subscribe((res) => {
      if (res) {
        const url = window.URL.createObjectURL(this.returnBlob(res));
        FileSaver.saveAs(res, this.filename);
        // window.open(url);
      }
    });
  }
  onCompelete() {
    this.userDataService.addCompleteRequest(this.req_id,this.accessID, this.user_name).subscribe((ResData) => {
      console.log(ResData);
    })
    this.route.navigateByUrl('/AmbienceMax/close');
  }
}
