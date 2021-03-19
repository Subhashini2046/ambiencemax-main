import { Component, ViewChild, OnInit} from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatSnackBar } from '@angular/material';
import { ReqSchema } from '../Services/ReqSchema';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements OnInit {
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
  public pncfilesName = '';
  public fieldValue = [];
  requestDetails: any[] = [];
  // for BOQ form
  boqDescription: "";
  boqEstimatedCost = 0;
  boqEstimatedTime: "";
  filepnc: any[] = [];
  public boqDescription1: "";
  public boqEstimatedCost1: number;
  boqEstimatedTime1: "";
  // for PNC form
  allocatedDays;
  allocationStartDate: " ";
  actualCost;
  allocateStartDate;
  images;
  multipleImages = [];
  attachmentList: any = [];
  RequestAllocatedVendor;
  displayedColumns = ['selected', 'Vendor Name', 'spoc1', 'spoc2', 'spoc3'];
  dataSource: any[] = [];
  selectedElement: any[] = [];
  date = new FormControl(new Date());
  user_name;
  admin_access_id;
  reqPnc;
  pncvendorSelection = '';
  reqComment;
  reqType = '';
  constructor(private route: Router, private actrouter: ActivatedRoute, private http: HttpClient, public UserDataService: UserDataService, private _snackBar: MatSnackBar, private router: Router) {

  }

  Approvers = [];
  num = 0;
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
    req_description: ''
  };
  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('userId'));
    this.currReq.req_initiator_id = this.userId;
    this.role_id = JSON.parse(localStorage.getItem('role_id'));
    this.user_name = JSON.parse(localStorage.getItem('user_name'));
    this.admin_access_id = JSON.parse(localStorage.getItem('admin_access_id'));
    this.actrouter.params.subscribe(params => {
      this.req_id = +params['id'];
    });
    this.actrouter.params.subscribe(params => {
      this.is_pnc = +params['pnc'];
      if (this.is_pnc == 1) {
        this.is_pnc = 1;
      }
      else
        this.is_pnc = 0
    });
    console.log('is_pnc', this.is_pnc, (this.role_id != 0 && this.is_pnc != 0));
    if (this.role_id == 3 || this.role_id == 4) {

      return this.UserDataService.getRequestDetails(this.req_id).subscribe((response: any) => {
        console.log(response)
      });
    }
  }
  public selectedSpoc;
  filestage;
  fileName = [];
  BoqfileName = [];
  pncSupportingDoc = [];
  ngAfterContentInit() {
    if (this.req_id > 0) {
      this.UserDataService.check_asRead(this.req_id).subscribe((response: any) => {
      });
    }
    if (this.is_pnc == 1) {
      this.UserDataService.getSpocDetails(this.req_id).subscribe((response: any) => {
        this.dataSource = response;
        this.selectedElement = response;
        this.selectedSpoc = this.dataSource.length;
      });
    }
    if ((this.role_id == 0 && this.req_id) || this.role_id != 0) {

      //request files
      this.UserDataService.getRequestFile(this.req_id).subscribe((response: any) => {
        for (let i = 0; i < response.length; i++) {
          if (response[i].RUMPRequestFilesStage == 1) {
            this.fileName.push(response[i].RUMPRequestFilesPath.replace(/^.*[\\\/]/, ''));
          }
          if (response[i].RUMPRequestFilesStage == 2) {
            this.BoqfileName.push(response[i].RUMPRequestFilesPath.replace(/^.*[\\\/]/, ''));
          }
          if (response[i].RUMPRequestFilesStage == 3) {
            this.pncSupportingDoc.push(response[i].RUMPRequestFilesPath.replace(/^.*[\\\/]/, ''));
          }
        }
      });

      //request details
      this.UserDataService.getRequestDetail(this.req_id).subscribe((response: any) => {
        this.requestDetails = response;
        this.currReq.budget_type = this.requestDetails[0]["BudgetType"];
        this.currReq.me_type = this.requestDetails[0]["METype"];
        this.currReq.available_budget = this.requestDetails[0]["RequestAvailableBudget"];
        this.currReq.balance_budget = this.requestDetails[0]["RequestBalanceBudget"];
        this.currReq.consumed_budget = this.requestDetails[0]["RequestConsumedBudget"];
        this.description = this.requestDetails[0]["RequestDescription"];
        this.currReq.req_swon = this.requestDetails[0]["RequestSWON"];
        this.subject = this.requestDetails[0]["RequestSubject"];
        this.currReq.req_type = this.requestDetails[0]["RequestType"];
        this.boqDescription1 = this.requestDetails[0]["BOQDescription"];
        this.boqDescription = this.requestDetails[0]["BOQDescription"];
        this.boqEstimatedCost = this.requestDetails[0]["BOQEstimatedCost"];
        this.boqEstimatedTime = this.requestDetails[0]["BOQEstimatedTime"];
        this.allocatedDays = this.requestDetails[0]["AllocatedDays"];
        this.allocationStartDate = this.requestDetails[0]["AllocationStartDate"];
        this.actualCost = this.requestDetails[0]["ActualCost"];
        this.is_pnc = this.requestDetails[0]["ispnc"];
        this.currReq.req_initiator_id = this.requestDetails[0]["initiatorId"];
        this.currReq.req_level = this.requestDetails[0]["requestLevel"];
        this.currReq.req_status = this.requestDetails[0]["RequestStatus"];
        this.RequestAllocatedVendor = this.requestDetails[0]["RequestAllocatedVendor"];
        this.reqComment = this.requestDetails[0]["requestComments"];
        this.reqPnc = response[0]["PNCUrl"]
        if (this.reqPnc != null) {
          this.reqPnc = this.reqPnc.replace(/^.*[\\\/]/, '')
        };
      });
    }
  }

  // calculate how many characters is left to type(subject)
  valueChange(value) {
    if (value != null) {
      this.remainingText = 100 - value.length;
    }
  }

  // calculate how many characters is left to type(subject)
  valueChangeDiscription(value) {
    if (value != null) {
      this.remaining_description = 5000 - value.length;
    }
  }
  // onMultipleSubmit() {

  //   var filesize = 0;
  //   const formData = new FormData();
  //   console.log("nnnnn", this.multipleImages)
  //   for (let img of this.multipleImages) {
  //     formData.append('files', img);
  //     filesize += img['size'];}
  //   var fileInMB = 10485760;
  //   if (filesize > fileInMB) {
  //     console.log("lll", filesize > fileInMB);
  //     this.areCredentialsInvalid = true;
  //     return;
  //   }
  // }
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
  fileList1: File[] = [];
  listOfFiles1: any[] = [];

  //add PNC Supporting document on list
  onPncFileChanged(event: any) {
    var filesize = 0;
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      this.fileList1.push(selectedFile);
      filesize += this.fileList1[i]['size'];
      this.listOfFiles1.push(selectedFile.name);
    }
    var fileInMB = 10485760;
    if (filesize > fileInMB) {
      console.log("lll", filesize > fileInMB);
      this.areCredentialsInvalid = true;
      return;
    }
    console.log("mmmm", this.fileList1);
    this.attachment.nativeElement.value = '';
  }

  // when user click on delete then it will remove that PNC Supporting document from the list
  removePncSelectedFile(index) {
    this.listOfFiles1.splice(index, 1);
    this.fileList1.splice(index, 1);
  }
  pncfile = [];
  pncfileName = [];

  //add PNC document on list
  onPncFile(event) {
    if (event.target.files.length < 1) {
      return false;
    }
    else {
      this.pncfile[0] = event.target.files[0];
      this.pncfileName[0] = event.target.files[0].name;
    }
  }
  removeselectedpncFile(index) {
    this.pncfileName.splice(index, 1);
    this.pncfile.splice(index, 1);
  }

  // when reuqest is raised(new request) then it store the request data in database.
  onSubmit() {
    this.currReq.req_subject = this.subject;
    this.currReq.req_description = this.description;
    this.currReq.req_initiator_id = JSON.parse(localStorage.getItem('admin_access_id'));
    const formData = new FormData();
    for (let img of this.fileList) {
      formData.append('files', img);
    }
    let obj = { ...this.currReq };
    this.http.post<any>('http://localhost:5600/multipleFiles', formData).subscribe((res) => {
      for (let i = 0; i < res.files.length; i++) {
        this.filepath[i] = res.files[i]['filename'];
      }
      console.log(this.filepath, "this.filepath");
      this.UserDataService.addRequest(obj, JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('user_name')), this.filepath,this.admin_access_id);
    });
    //this.openSnackBar('Request Submitted Successfully !');

  }

  // update the reuqest data
  onSumbitForUpdate() {
    this.currReq.req_subject = this.subject;
    this.currReq.req_description = this.description;
    const formData = new FormData();
    for (let img of this.fileList) {
      formData.append('files', img);
    }
    let obj = { ...this.currReq };
    this.http.post<any>('http://localhost:5600/multipleFiles', formData).subscribe((res) => {
      for (let i = 0; i < res.files.length; i++) {
        this.filepath[i] = res.files[i]['filename'];
      }
      this.UserDataService.updateRequest(this.is_pnc, obj, this.admin_access_id, this.req_id, JSON.parse(localStorage.getItem('user_name')), this.filepath);
    });

  }

  //store the BQO details in database.
  onBOQSubmit() {
    let boqDis = this.boqDescription;
    let boqCost = this.boqEstimatedCost;
    let boqTime = this.boqEstimatedTime;
    const formData = new FormData();
    let id = '' + this.req_id;
    formData.append('id', id);
    for (let img of this.fileList) {
      formData.append('files', img);
    }
    this.http.post<any>('http://localhost:5600/BoqFiles', formData).subscribe((res) => {
      for (let i = 0; i < res.files.length; i++) {
        this.filepath[i] = res.files[i]['filename'];
      }
      this.UserDataService.addBOQDDetails(this.req_id, this.role_id, boqDis, boqCost, boqTime, this.filepath, this.admin_access_id, this.user_name);
      //   this.router.navigateByUrl('/AmbienceMax/open');
      this.openSnackBar('Request Submitted Successfully !');
    });

  }

  // disable the submit button 
  onPncChange() {
    if (this.reqPnc == null) {
      if (this.selectedElement.length > 0) {
        if (this.actualCost == null || this.allocatedDays == null || this.allocationStartDate == null || this.pncvendorSelection == '' || this.pncfile.length<1) {
          return true
        }
      }
      else {
        if (this.actualCost == null || this.pncfile.length<1) {
          return true
        }
      }
    }
    return false
  }

  //store the Pnc details in database.
  onPncSumbit() {
    let allocationStartDate = this.allocationStartDate;
    let cost = this.actualCost;
    let allocatedDay = this.allocatedDays;
    // pnc supporting doc
    const formData = new FormData();
    let id = '' + this.req_id;
    formData.append('id', id);
    for (let img of this.fileList1) {
      formData.append('files', img);
    }
    // pnc doc
    const formData1 = new FormData();
    formData1.append('id', id);
    formData1.append('files', this.pncfile[0]);
    let VendorPk = this.pncvendorSelection["rumpvenVendorPK"];
    this.http.post<any>('http://localhost:5600/BoqFiles', formData).subscribe((res) => {
      for (let i = 0; i < res.files.length; i++) {
        this.filepnc[i] = res.files[i]['filename'];
      }
      this.http.post<any>('http://localhost:5600/pncFiles', formData1).subscribe((res) => {
        console.log(this.pncfile.length);
        if (this.pncfile.length > 0) {
          console.log(res.files[0]['filename'], "hh")
          this.pncfilesName = res.files[0]['filename'];
          this.UserDataService.addPncByInitiator(allocatedDay, allocationStartDate, cost, this.req_id, VendorPk, this.filepnc, this.pncfilesName, this.admin_access_id, this.user_name);
        } else {
          this.UserDataService.addPncByInitiator1(allocatedDay, allocationStartDate, cost, this.req_id, VendorPk, this.filepnc, this.admin_access_id, this.user_name);
        }
      });
      console.log(this.pncfilesName);
    });
  }

  // for approving the reuqest
  onApprove() {
    this.UserDataService.meType = this.currReq.me_type;
    this.route.navigate(['/AmbienceMax/approveRequest', this.req_id]);
  }

  // for resend reuqest
  onResend() {
    this.route.navigate(['/AmbienceMax/dialogg/', this.req_id, this.is_pnc]);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 3500,
      panelClass: ['simple-snack-bar']
    });


  }

  returnBlob(res): Blob {
    console.log('file downloaded');
    return new Blob([res], { type: 'pdf' });
  }

  // download request,BOQ and PNC supporting file
  download(downloadfile) {
    this.UserDataService.getFiles(downloadfile).subscribe((res) => {
      if (res) {
        const url = window.URL.createObjectURL(this.returnBlob(res));
        FileSaver.saveAs(res, downloadfile);
        // window.open(url);
      }
    });
    return false;
  }

  // download PNC file
  downloadFile(downloadfile) {
    this.UserDataService.downloadFile(downloadfile).subscribe((res) => {
      if (res) {
        const url = window.URL.createObjectURL(this.returnBlob(res));
        FileSaver.saveAs(res, downloadfile);
        // window.open(url);
      }
    });
    return false;
  }
}
