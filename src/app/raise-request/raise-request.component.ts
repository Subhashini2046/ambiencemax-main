import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatSnackBar } from '@angular/material';
import { ReqSchema } from '../Services/ReqSchema';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { auditTime } from 'rxjs/operators';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-raise-request',
  templateUrl: './raise-request.component.html',
  styleUrls: ['./raise-request.component.css']
})
export class RaiseRequestComponent implements OnInit {
  public userId;
  public role_id;
  req_id = 0;
  is_pnc = 0;
  remainingText = 100;
  remaining_description = 5000;
  description = "";
  subject = "";
  AllFileName: any[] = [];
  areCredentialsInvalid = false;
  public filepath = [];
  user_name;
  admin_access_id;
  reqPnc;
  pncvendorSelection = '';
  reqComment;
  reqType = '';
  actualCost1;
  raiseRequestId;
  checkoutForm;
  draftReqId;
  requestDetails: any[] = [];
  public keyUp = new Subject<KeyboardEvent>();
  constructor(private formBuilder: FormBuilder, private route: Router, private actrouter: ActivatedRoute, private http: HttpClient, public UserDataService: UserDataService, private _snackBar: MatSnackBar, private router: Router) {
    this.checkoutForm = this.formBuilder.group({
      me_type: '',
      req_swon: '',
      budget_type: '',
      req_type: '',
      available_budget: 0,
      consumed_budget: 0,
      balance_budget: 0,
      subject: new FormControl('', Validators.required),
      description: ''
    });
  }
  currReq: ReqSchema = {
    req_date: '',
    req_id: 0,
    req_initiator_id: 0,
    req_level: 1,
    req_status: 'Pending',
    req_number: '',
    req_type: '',
    w_id: 0,
    me_type: '',
    req_swon: '',
    budget_type: '',
    available_budget: 0,
    consumed_budget: 0,
    balance_budget: 0,
    req_subject: '',
    req_description: '',
    draftReqId: 0
  };

 
  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('userId'));
    this.currReq.req_initiator_id = this.userId;
    this.role_id = JSON.parse(localStorage.getItem('role_id'));
    this.user_name = JSON.parse(localStorage.getItem('user_name'));
    this.admin_access_id = JSON.parse(localStorage.getItem('admin_access_id'));
    this.actrouter.params.subscribe(params => {
      this.draftReqId = +params['id'];
    });
    if (this.draftReqId > 0) {
      this.fetchDraftRequest(this.draftReqId);
    }
  }
  fetchDraftRequest(draftReqId) {
    this.UserDataService.fetchDraftRequest(draftReqId).subscribe((response: any) => {
      this.requestDetails = response
      this.checkoutForm.controls['req_swon'].setValue(this.requestDetails[0]["RUMPRequestSWON"]);
      this.checkoutForm.controls['available_budget'].setValue(this.requestDetails[0]["RUMPRequestAvailableBudget"]);
      this.checkoutForm.controls['consumed_budget'].setValue(this.requestDetails[0]["RUMPRequestConsumedBudget"]);
      this.checkoutForm.controls['balance_budget'].setValue(this.requestDetails[0]["RUMPRequestBalanceBudget"]);
      this.checkoutForm.controls['subject'].setValue(this.requestDetails[0]["RUMPRequestSubject"]);
      this.checkoutForm.controls['description'].setValue(this.requestDetails[0]["RUMPRequestDescription"]);
      if (this.requestDetails[0]["RUMPRequestMEType"] == 0) {
        this.checkoutForm.controls['me_type'].setValue("Civil");
      }
      if (this.requestDetails[0]["RUMPRequestMEType"] == 1) {
        this.checkoutForm.controls['me_type'].setValue("Electrical");
      }
      if (this.requestDetails[0]["RUMPRequestBudgetType"] == 0) {
        this.checkoutForm.controls['budget_type'].setValue("Capex");
      }
      if (this.requestDetails[0]["RUMPRequestBudgetType"] == 1) {
        this.checkoutForm.controls['budget_type'].setValue("Opex");
      }
      if (this.requestDetails[0]["RUMPRequestType"] == "Upgrade") {
        this.checkoutForm.controls['req_type'].setValue("Upgrade");
      } if (this.requestDetails[0]["RUMPRequestType"] == "Repair") {
        this.checkoutForm.controls['req_type'].setValue("Repair");
      } if (this.requestDetails[0]["RUMPRequestType"] == "Maintenance") {
        this.checkoutForm.controls['req_type'].setValue("Maintenance");
      }
    });
  }
  ngAfterContentInit() {
    this.checkoutForm.get("subject").valueChanges.subscribe(selectedValue => {
      let formSubject=this.checkoutForm.get("subject").value;
      if (formSubject != null) {
        this.remainingText = 100 - formSubject.length;
      }
    });
    this.checkoutForm.get("description").valueChanges.subscribe(selectedValue => {
      let formDescription=this.checkoutForm.get("description").value;
      if (formDescription != null) {
        this.remaining_description = 5000 - formDescription.length;
      }
    });
    if (this.draftReqId > 0) {
      this.checkoutForm.valueChanges.pipe(auditTime(1000)).subscribe((formData: any) => {
        this.UpdateautoSaveFormData();
      });
    } else {
      this.checkoutForm.valueChanges.pipe(auditTime(1000)).subscribe((formData: any) => {
        if (this.raiseRequestId > 0) {
          this.UpdateautoSaveFormData();
        }
        else
          this.autoSaveFormData();
      });
    }
  }
  passCheckoutFormDataToCurrReq() {
    this.currReq.me_type = this.checkoutForm.value.me_type
    this.currReq.req_swon = this.checkoutForm.value.req_swon
    this.currReq.budget_type = this.checkoutForm.value.budget_type
    this.currReq.req_type = this.checkoutForm.value.req_type
    this.currReq.available_budget = this.checkoutForm.value.available_budget
    this.currReq.consumed_budget = this.checkoutForm.value.consumed_budget
    this.currReq.balance_budget = this.checkoutForm.value.balance_budget
    this.currReq.req_subject = this.checkoutForm.value.subject
    this.currReq.req_description = this.checkoutForm.value.description
  }
  //autosave
  autoSaveFormData() {
    this.passCheckoutFormDataToCurrReq();
    this.UserDataService.saveDraftRequest(this.currReq, JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('role_id'))).subscribe((data: any) => {
      console.log("result", data.id);
      this.raiseRequestId = data.id;
    });
  }
  UpdateautoSaveFormData() {
    this.passCheckoutFormDataToCurrReq();
    if (this.draftReqId > 0) {
      this.UserDataService.updateDraftRequest(this.currReq, this.draftReqId).subscribe((data: any) => {
        console.log("result", data);
      });
    }
    else {
      this.UserDataService.updateDraftRequest(this.currReq, this.raiseRequestId).subscribe((data: any) => {
        console.log("result", data);
      });
    }
  }
  // calculate how many characters is left to type(subject)
  valueChange(value) {
    console.log("fffffff");
    if (value != null) {
      this.remainingText = 100 - value.length;
      // this.sub();
    }
  }

  // sub(){
  //     this.subscription = interval(5000).subscribe((val: any) => {
  //     if (this.raiseRequestId > 0)
  //       this.UpdateautoSaveFormData();
  //     else
  //       this.autoSaveFormData();
  //  });
  // }

  // calculate how many characters is left to type(subject)
  valueChangeDiscription(value) {
    if (value != null) {
      this.remaining_description = 5000 - value.length;
    }
  }
  @ViewChild('attachments', { static: false }) attachment: any;

  fileList: File[] = [];
  listOfFiles: any[] = [];

  //it will store the file selected by users when reuqest is raised
  onFileChanged(event: any) {
    var filesize = 0;
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      this.fileList.push(selectedFile);
      filesize += this.fileList[i]['size'];
      this.listOfFiles.push(selectedFile.name);
    }
    var fileInMB = 10485760;
    if (filesize > fileInMB) {
      console.log("lll", filesize > fileInMB);
      this.areCredentialsInvalid = true;
      return;
    }
    console.log("mmmm", this.fileList);
    this.attachment.nativeElement.value = '';
  }


  // when user click on delete then it will remove that file from the list
  removeSelectedFile(index) {
    this.listOfFiles.splice(index, 1);
    this.fileList.splice(index, 1);
  }

  // when reuqest is raised(new request) then it store the request data in database.
  onSubmit() {
    this.passCheckoutFormDataToCurrReq();
    if(this.draftReqId>0){
    this.currReq.draftReqId = this.draftReqId;}
    else{
      this.currReq.draftReqId = this.raiseRequestId;
    }
    this.currReq.req_initiator_id = JSON.parse(localStorage.getItem('admin_access_id'));
    const formData = new FormData();
    for (let img of this.fileList) {
      formData.append('files', img);
    }
    let obj = { ...this.currReq };
    this.http.post<any>(this.UserDataService.URL + 'multipleFiles', formData).subscribe((res) => {
      for (let i = 0; i < res.files.length; i++) {
        this.filepath[i] = res.files[i]['filename'];
      }
      console.log(this.filepath, "this.filepath");
      this.UserDataService.addRequest(obj, JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('user_name')), this.filepath, this.admin_access_id);
    });
    //this.openSnackBar('Request Submitted Successfully !');

  }
}
