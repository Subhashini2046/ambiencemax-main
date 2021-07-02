import { Component, ViewChild, OnInit} from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatSnackBar,MatDialog } from '@angular/material';
import { ReqSchema } from '../Services/ReqSchema';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl,FormBuilder } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { Subscription, } from 'rxjs';
import { SpoceDetailsComponent } from '../spoce-details/spoce-details.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable';
//import { CancelRequestComponent } from '../cancel-request/cancel-request.component';
//import {CancelRequestService} from '../cancel-request/Cancel-request.service';
@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css'],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
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
  actualCost1;
  subscription: Subscription;
  raiseRequestId;
  checkoutForm;
  replacePnc = 0;
  delete_file = [];
  delete_Boq_file = [];
  delete_pnc_file = [];
  delete_pnc_doc = '';
  delete_pnc_option = 0;
  isLoading = false;
  isLoadingRequest = false;
  isLoadingPnc = false;
  pdfTableData: any[] = [];
  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private route: Router, private actrouter: ActivatedRoute, private http: HttpClient, public userService: UserDataService, private _snackBar: MatSnackBar, private router: Router) {
    this.checkoutForm = this.formBuilder.group({
      me_type: '',
      req_swon: '',
      budget_type: '',
      req_type: '',
      available_budget: 0,
      consumed_budget: 0,
      balance_budget: 0,
      subject: '',
      description: ''
    });
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
    req_description: '',
    draftReqId: 0
  };

  openDialog(venSpoc1, venSpoc1Address, venSpoc1Email, venSpoc1Mobile, venSpoc1Phone): void {
    let dialogRef = this.dialog.open(SpoceDetailsComponent, {
      width: '550px',
      data: { venSpoc: venSpoc1, venSpocAddress: venSpoc1Address, venSpocEmail: venSpoc1Email, venSpocMobile: venSpoc1Mobile, venSpocPhone: venSpoc1Phone }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

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
  }
  public selectedSpoc;
  filestage;
  fileName = [];
  BoqfileName = [];
  pncSupportingDoc = [];
  ngAfterContentInit() {
    console.log(this.isLoadingPnc,(!this.isLoadingPnc));
    if (this.req_id > 0) {
      this.userService.check_asRead(this.req_id).subscribe((response: any) => {
        console.log("check as read");
      });
    }
    this.getSpoceDetails();
    if ((this.role_id == 0 && this.req_id) || this.role_id != 0) {
      //request files
      this.getRequestFiles();

      //request details
      this.getRequestDetails();
    }
  }

  getSpoceDetails() {
    this.userService.getSpocDetails(this.req_id).subscribe((response: any) => {
      this.dataSource = response;
      this.selectedElement = response;
      this.selectedSpoc = this.dataSource.length;
    });
  }

  getRequestDetails() {
    this.userService.getRequestDetail(this.req_id).subscribe((response: any) => {
      this.requestDetails = response;
      this.currReq.req_number=this.requestDetails[0]["RequestNumber"];
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
      this.actualCost1 = this.actualCost;
      this.is_pnc = this.requestDetails[0]["ispnc"];
      this.currReq.req_initiator_id = this.requestDetails[0]["initiatorId"];
      this.currReq.req_level = this.requestDetails[0]["requestLevel"];
      this.currReq.req_status = this.requestDetails[0]["RequestStatus"];
      this.RequestAllocatedVendor = this.requestDetails[0]["RequestAllocatedVendor"];
      if (this.RequestAllocatedVendor != null) {
        for (let i = 0; i < this.selectedElement.length; i++) {
          if (this.RequestAllocatedVendor == this.selectedElement[i].rumpvenVendorPK) {
            this.pncvendorSelection = this.selectedElement[i];
            break;
          }
        }
      }
      this.reqComment = this.requestDetails[0]["requestComments"];
      this.reqPnc = response[0]["PNCUrl"]
      if (this.reqPnc != null) {
        this.reqPnc = this.reqPnc.replace(/^.*[\\\/]/, '')
      }
    });
  }

  getRequestFiles() {
    this.userService.getRequestFile(this.req_id).subscribe((response: any) => {
      for (let i = 0; i < response.length; i++) {
        if (response[i].RUMPRequestFilesStage == 1) {
          this.fileName.push({ fileName: response[i].RUMPRequestFilesPath.replace(/^.*[\\\/]/, ''), file_pk: response[i].RUMPRequestFilesPK });
        }
        if (response[i].RUMPRequestFilesStage == 2) {
          this.BoqfileName.push({ fileName: response[i].RUMPRequestFilesPath.replace(/^.*[\\\/]/, ''), file_pk: response[i].RUMPRequestFilesPK });
        }
        if (response[i].RUMPRequestFilesStage == 3) {
          this.pncSupportingDoc.push({ fileName: response[i].RUMPRequestFilesPath.replace(/^.*[\\\/]/, ''), file_pk: response[i].RUMPRequestFilesPK });
        }
      }
    });
  }

  // calculate how many characters is left to type(subject)
  valueChange(value) {
    if (value != null) {
      this.remainingText = 100 - value.length;
    }
  }

  cancelRequest() {
    this.userService.cancelRequest(this.req_id).subscribe((response: any) => {
      this.openSnackBar('Request Cancelled Successfully !');
      this.router.navigateByUrl('/AmbienceMax/open');
    })
  }


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
      this.areCredentialsInvalid = true;
      return;
    }
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
      this.areCredentialsInvalid = true;
      return;
    }
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
    this.http.post<any>(this.userService.URL + 'multipleFiles', formData).subscribe((res) => {
      for (let i = 0; i < res.files.length; i++) {
        this.filepath[i] = res.files[i]['filename'];
      }
      this.userService.addRequest(obj, JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('user_name')), this.filepath, this.admin_access_id);
    });
  }

  // update the reuqest data
  onSumbitForUpdate() {
    this.isLoadingRequest = true;
    this.currReq.req_subject = this.subject;
    this.currReq.req_description = this.description;
    const formData = new FormData();
    for (let img of this.fileList) {
      formData.append('files', img);
    }
    let obj = { ...this.currReq };
    this.http.post<any>(this.userService.URL + 'multipleFiles', formData).subscribe((res) => {
      for (let i = 0; i < res.files.length; i++) {
        this.filepath[i] = res.files[i]['filename'];
      }

      this.userService.updateRequest(this.is_pnc, obj, this.admin_access_id, this.req_id, JSON.parse(localStorage.getItem('user_name')), this.filepath, this.delete_file);
    });

  }

  //store the BQO details in database.
  onBOQSubmit() {
    this.isLoading = true;
    let boqDis = this.boqDescription;
    let boqCost = this.boqEstimatedCost;
    let boqTime = this.boqEstimatedTime;
    const formData = new FormData();
    let id = '' + this.req_id;
    formData.append('id', id);
    for (let img of this.fileList) {
      formData.append('files', img);
    }
    this.http.post<any>(this.userService.URL + 'BoqFiles', formData).subscribe((res) => {
      for (let i = 0; i < res.files.length; i++) {
        this.filepath[i] = res.files[i]['filename'];
      }
      this.userService.addBOQDDetails(this.req_id, this.role_id, boqDis, boqCost, boqTime, this.filepath, this.admin_access_id, this.user_name, this.delete_Boq_file);
      this.openSnackBar('Request Submitted Successfully !');
    });

  }

  // disable the submit button 
  onPncChange() {
    if (this.reqPnc == null) {
      if (this.selectedElement.length > 0) {
        if (this.isLoadingPnc || this.actualCost == null || this.allocatedDays == null || this.allocationStartDate == null || this.pncvendorSelection == '' || this.pncfile.length < 1) {
          return true
        }
      }
      else {
        if (this.isLoadingPnc || this.actualCost == null || this.pncfile.length < 1) {
          return true
        }
      }
    }
    return false
  }

  //store the Pnc details in database.
  onPncSumbit() {
    this.isLoadingPnc = true;
    let allocationStartDate = this.allocationStartDate;
    let cost = this.actualCost;
    let allocatedDay = this.allocatedDays;
    console.log(allocationStartDate);
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
    if (VendorPk == null) { VendorPk = this.RequestAllocatedVendor }
    this.http.post<any>(this.userService.URL + 'BoqFiles', formData).subscribe((response) => {
      for (let i = 0; i < response.files.length; i++) {
        this.filepnc[i] = response.files[i]['filename'];
      }
      this.http.post<any>(this.userService.URL + 'pncFiles', formData1).subscribe((res) => {

        if (this.delete_pnc_option == 0) {
          if (this.pncfile.length > 0) {
            this.pncfilesName = res.files[0]['filename'];
            this.userService.addPncByInitiator(allocatedDay, allocationStartDate, cost, this.req_id, VendorPk, this.filepnc, this.pncfilesName, this.admin_access_id, this.user_name);
          } else {
            this.userService.addPncByInitiator1(allocatedDay, allocationStartDate, cost, this.req_id, VendorPk, this.filepnc, this.admin_access_id, this.user_name);
          }
        }
        else if (this.delete_pnc_option == 1) {
          if (this.pncfile.length > 0) {
            this.pncfilesName = res.files[0]['filename'];
          }
          this.userService.pncSumbitWhenDelete(this.pncfilesName, allocatedDay, allocationStartDate, cost, this.req_id, VendorPk, this.filepnc, this.admin_access_id, this.user_name, this.delete_pnc_file, this.delete_pnc_doc);
        }
      });
    });

  }

  // for approving the reuqest
  onApprove() {
    this.userService.meType = this.currReq.me_type;
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
    this.userService.getFiles(downloadfile).subscribe((res) => {
      if (res) {
        FileSaver.saveAs(res, downloadfile);
      }
    });
    return false;
  }

  // download PNC file
  downloadFile(downloadfile) {
    this.userService.downloadFile(downloadfile).subscribe((response:any) => {
      if (response) {
        FileSaver.saveAs(response, downloadfile);
      }
    });
    return false;
  }
  deleteReqDoc(file) {
    this.delete_file.push(file);
    for (let i = 0; i < this.fileName.length; i++) {
      if (file.file_pk == this.fileName[i].file_pk) {
        this.fileName.splice(i, 1);
      }
    }
    return false;
  }
  deletePncFile(file) {
    this.delete_pnc_option = 1;
    this.delete_pnc_file.push(file);
    for (let i = 0; i < this.pncSupportingDoc.length; i++) {
      if (file.file_pk == this.pncSupportingDoc[i].file_pk) {
        this.pncSupportingDoc.splice(i, 1);
      }
    }
    return false;
  }
  deleteBoqDoc(file) {
    this.delete_Boq_file.push(file);
    for (let i = 0; i < this.BoqfileName.length; i++) {
      if (file.file_pk == this.BoqfileName[i].file_pk) {
        this.BoqfileName.splice(i, 1);
      }
    }
    return false;
  }
  deletePncDoc(file) {
    this.delete_pnc_option = 1;
    this.reqPnc = null;
    this.delete_pnc_doc = file;
    this.replacePnc = 1;
    return false;
  }


  newDate(newdate){
    return  newdate.slice(0, 10) + " " + newdate.slice(11, 21);
  }
  // formate the date
  dateFormate(date) {
    return this.newDate(date.toString());
  }
  // responsible for inserting the extra space between the text 
  space(name) {
    let space = " Signature:________________ Date: 2020-05-29 10:06:31.0                                      "
    let count = space.length - name.length;

    let NumberOfspace = " ";
    for (let i = 0; i < count; i++) {
      NumberOfspace += " ";
    }
    return NumberOfspace;
  }
   // download pdf of request form
   ExportPDF() {
    this.pdfTableData = [];
    this.userService.getpdfTableData(this.req_id).subscribe((res: any) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i] != null) {
          this.pdfTableData.push(res[i]);
        }
      }
      const doc = new jsPDF('p', 'pt', 'a4');
      let reqNum = this.currReq.req_number.indexOf('Form');

      autoTable(doc, { html: '#my-table' })
      const columns1 = [[this.currReq.req_number.slice(reqNum, reqNum + 5)]];
      const data2 = [];

      data2.push(["Request No: " + this.currReq.req_number + "             " + "Date: " + this.dateFormate(this.pdfTableData[0].actionTiming)]);
      data2.push(["SWON / WON : " + this.currReq.req_swon + "             " + "Budget: " + this.currReq.budget_type]);
      data2.push(["Available(INR): " + this.currReq.available_budget + "             " + "Consumed(INR): " + this.currReq.consumed_budget + "             " + "Balance(INR): " + this.currReq.balance_budget]);
      data2.push(["Subject: " + this.subject]);
      data2.push(["Description: " + this.description]);
      for (let i = 0; i < this.pdfTableData.length; i++) {
        if (this.pdfTableData[i].action == 'Initiated Phase 1') {
          let adspace1 = this.space("Initiator: User Dept/ Admin" + "               " + "Name: " + this.pdfTableData[i].user);
          data2.push(["Initiator: User Dept/ Admin" + "               " + "Name: " + this.pdfTableData[i].user + adspace1
            + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[i].actionTiming)])
        }
        else if (this.pdfTableData[i].roleId == 1) {
          let lspace1 = this.space("Recommender: Local Administration." + "               " + "Name: " + this.pdfTableData[i].user);
          data2.push(["Recommender: Local Administration." + "               " + "Name: " + this.pdfTableData[i].user + lspace1
            + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[i].actionTiming)])
        }
        else if (this.pdfTableData[i].roleId == 2) {
          let cspace1 = this.space("From : Cluster Head" + "               " + "Name: " + this.pdfTableData[2].user);
          data2.push(["From : Cluster Head" + "               " + "Name: " + this.pdfTableData[2].user + cspace1
            + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[2].actionTiming)])
          data2.push([""]);
        }
        else if (this.pdfTableData[i].roleId == 3 || this.pdfTableData[i].roleId == 4) {
          let espace1 = this.space("From : Engineer" + "               " + "Name: " + this.pdfTableData[i].user);

          data2.push(["From : Engineer" + "               " + "Name: " + this.pdfTableData[i].user + espace1
            + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[i].actionTiming)])
          data2.push(["Description: " + this.boqDescription])
          data2.push(["Estimated cost for the work(INR): " + this.boqEstimatedCost])
          data2.push(["Estimated time for the work: " + this.boqEstimatedTime])
          data2.push([""]);
        }
        else if (this.pdfTableData[i].roleId == 5) {
          let hspace1 = this.space("From : Head of Maintenance" + "               " + "Name: " + this.pdfTableData[i].user);

          data2.push(["From : Head of Maintenance" + "               " + "Name: " + this.pdfTableData[i].user + hspace1
            + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[i].actionTiming)])
          data2.push([""]);
        }
        else if (this.pdfTableData[i].action == 'Initiated Phase 2') {
          let ispace1 = this.space("From : Initiator" + "               " + "Name: " + this.pdfTableData[i].user);

          data2.push(["From : Initiator" + "               " + "Name: " + this.pdfTableData[i].user + ispace1
            + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[i].actionTiming)])

          data2.push(["Actual Cost(INR): " + this.actualCost]);
          data2.push([""]);
        }
        else if (this.pdfTableData[i].roleId == 6) {
          let bspace1 = this.space("From : Branch PMO" + "               " + "Name: " + this.pdfTableData[i].user);

          data2.push(["From : Branch PMO" + "               " + "Name: " + this.pdfTableData[i].user + bspace1
            + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[i].actionTiming)])
        }
        else if (this.pdfTableData[i].roleId == 7) {
          let aspace1 = this.space("Approved by: Administration Head" + "               " + "Name: " + this.pdfTableData[i].user);

          data2.push(["Approved by: Administration Head" + "               " + "Name: " + this.pdfTableData[i].user + aspace1
            + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[i].actionTiming)])
        }
        else if (this.pdfTableData[i].roleId == 9) {
          let cespace1 = this.space("Approved by: Administration Head" + "               " + "Name: " + this.pdfTableData[i].user);

          data2.push(["Approved by: Centre Head" + "               " + "Name: " + this.pdfTableData[i].user + cespace1
            + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[i].actionTiming)])
        }
      }
      autoTable(doc, {
        head: columns1,
        theme: 'grid',
        columnStyles: { 4: { cellPadding: 2 }, columns3: { fillColor: "black" } },
        body: data2,
        tableLineColor: 200,
        styles: { fontSize: 12, textColor: 20, font: "times" },
        didParseCell: function (data) {
          if (data.row.raw[0] === "") {
            data.cell.styles.fillColor = [62, 172, 148];
          }
          if (data.row.raw[0].includes("Initiator:") || data.row.raw[0].includes("Recommender:") ||
            data.row.raw[0].includes("Approved by:") || data.row.raw[0].includes("From :")) {
            data.cell.styles.fontStyle = "bold"
          }
        },
        didDrawPage: (dataArg) => {
          doc.text('', dataArg.settings.margin.left, 10);
        }

      });

      const columns = [['User', 'Role', 'Action', 'Action Timing', 'Comment']];
      const data1 = [];
      if (this.pdfTableData.length > 0) {
        for (let i = 0; i < this.pdfTableData.length; i++) {
          data1.push([this.pdfTableData[i].user, this.pdfTableData[i].role1, this.pdfTableData[i].action, this.dateFormate(this.pdfTableData[i].actionTiming), this.pdfTableData[i].comment])
        }
      }
      doc.addPage();

      autoTable(doc, {
        head: columns,
        columnStyles: { 4: { cellPadding: 2, cellWidth: 'auto' }, },
        body: data1,
        theme: 'grid',
        startY: 80,//Where the table should start to be printed
        tableLineColor: 200,
        styles: { fontSize: 12, textColor: 20, font: "times" },
        didDrawPage: (dataArg) => {
          doc.text('Request Workflow', 230, 50)
        }

      });
      doc.save('AmbienceMax_Form_' + this.req_id + '.pdf');
    })
    return false;
  }

  // showDialog(): void {
  //   this.cancelRequestService.confirmThis(this.req_id,"Are you sure to delete?", function () {  
  //     alert("Yes clicked");  
  //   }, function () {  
  //     alert("No clicked");  
  //   }) 
  // }
}
