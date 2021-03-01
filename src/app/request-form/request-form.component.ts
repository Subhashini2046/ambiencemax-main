import { vendor } from './../approve-request/approve-request.component';
import { Component, ViewChild, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatSnackBar } from '@angular/material';
import { format } from 'url';
import { ReqSchema } from '../Services/ReqSchema';
import { FormsModule } from "@angular/forms";
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
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
  public fieldValue = [];
  requestDetails: any[] = [];
  // for BOQ form
  boqDescription: "";
  boqEstimatedCost= 0;
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
  pncvendorSelection='';
  reqComment;
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
    console.log('this.req_id ', this.req_id);
    this.userId = JSON.parse(localStorage.getItem('userId'));
    console.log('user_id', this.userId);
    this.currReq.req_initiator_id = this.userId;
    this.role_id = JSON.parse(localStorage.getItem('role_id'));
    console.log('this.role_id', this.role_id);
    this.user_name = JSON.parse(localStorage.getItem('user_name'));
    this.admin_access_id = JSON.parse(localStorage.getItem('admin_access_id'));
    this.actrouter.params.subscribe(params => {
      this.req_id = +params['id'];
      console.log('this.req_id ', this.req_id);
    });
    this.actrouter.params.subscribe(params => {
      this.is_pnc = +params['pnc'];
      if (this.is_pnc == 1) {
        this.is_pnc = 1;
      }
      else
        this.is_pnc = 0
    });
    //console.log((this.role_id != 0 && this.is_pnc!=0),this.role_id != 0,this.is_pnc!=0);
    console.log('is_pnc', this.is_pnc,(this.role_id != 0 && this.is_pnc!=0));
    if (this.role_id == 3 || this.role_id == 4) {
      return this.UserDataService.getRequestDetails(this.req_id).subscribe((response: any) => {
        console.log(response)
      });
    }
  }
  public selectedSpoc;
  filestage;
   fileName=[];
 BoqfileName=[];

  ngAfterContentInit() {
    if (this.req_id > 0) {
      this.UserDataService.check_asRead(this.req_id).subscribe((response: any) => {
        console.log(response, "check_asRead");
      });
    }
    if (this.is_pnc == 1) {
      this.UserDataService.getSpocDetails(this.req_id).subscribe((response: any) => {
        this.dataSource = response;
        this.selectedElement = response;
        this.selectedSpoc = this.dataSource.length;
        console.log(response);
      });
    }
    if ((this.role_id == 0 && this.req_id) || this.role_id != 0) {
      this.UserDataService.getRequestFile(this.req_id).subscribe((response: any) => {
        for(let i=0;i<response.length;i++){
          if(response[i].RUMPRequestFilesStage==1){
            this.fileName.push(response[i].RUMPRequestFilesPath.replace(/^.*[\\\/]/, ''));
            console.log(this.fileName);
          }
          if(response[i].RUMPRequestFilesStage==2){
            this.BoqfileName.push(response[i].RUMPRequestFilesPath.replace(/^.*[\\\/]/, ''));
          }
        }
      });
      

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
        this.reqComment=this.requestDetails[0]["requestComments"];
        console.log("//",this.reqComment);
        this.reqPnc = response[0]["PNCUrl"]
        if(this.reqPnc!=null){
          this.reqPnc=this.reqPnc.replace(/^.*[\\\/]/, '')};
        // for(let i=0;i<this.selectedElement.length;i++){
        //   if(this.RequestAllocatedVendor==this.selectedElement[i]["rumpvenVendorPK"]){

        //   }
        // }
        console.log((this.role_id == 0 && this.currReq.req_status == 'Closed'));
        console.log(this.RequestAllocatedVendor, "hh");
        console.log((this.currReq.req_status != 'Closed'));
      });
    }
  }

  valueChange(value) {
    if(value!=null){
    this.remainingText = 100 - value.length;}
  }
  valueChangeDiscription(value) {
    if(value!=null){
    this.remaining_description = 5000 - value.length;}
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



  removeSelectedFile(index) {
    this.listOfFiles.splice(index, 1);
    this.fileList.splice(index, 1);
  }
  fileList1: File[] = [];
  listOfFiles1: any[] = [];
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
  removePncSelectedFile(index) {
    this.listOfFiles1.splice(index, 1);
    this.fileList1.splice(index, 1);
  }
  onSubmit() {
    this.currReq.req_subject = this.subject;
    this.currReq.req_description = this.description;
    this.currReq.req_initiator_id = JSON.parse(localStorage.getItem('admin_access_id'));
    const formData = new FormData();
    for (let img of this.fileList) {
      formData.append('files', img);
    }
    this.http.post<any>('http://localhost:5600/multipleFiles', formData).subscribe((res) => {
      for (let i = 0; i < res.files.length; i++) {
        this.filepath[i] = res.files[i]['filename'];
      }
    });

    console.log(this.filepath,"this.filepath");
    //this.openSnackBar('Request Submitted Successfully !');
    this.UserDataService.addRequest(this.currReq, JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('user_name')), this.filepath);
  }
  onSumbitForUpdate(){
    this.currReq.req_subject = this.subject;
    this.currReq.req_description = this.description;
    this.UserDataService.updateRequest(this.is_pnc,this.currReq,this.admin_access_id,this.req_id, JSON.parse(localStorage.getItem('user_name'))).subscribe((res)=>{
      this.openSnackBar('Request Updated Successfully !');
      this.router.navigateByUrl('/AmbienceMax/open');
    });
  }
  onBOQSubmit() {
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

    });

    this.openSnackBar('Request Submitted Successfully !');
    this.UserDataService.addBOQDDetails(this.req_id, this.role_id, this.boqDescription, this.boqEstimatedCost, this.boqEstimatedTime, this.filepath,this.admin_access_id, this.user_name);
    this.router.navigateByUrl('/AmbienceMax/open');
  }
  onPncChange(){
    if(this.actualCost==null || this.allocatedDays==null || this.allocationStartDate==null || this.pncvendorSelection==''){
      return true
    }
    return false
  }
  onPncSumbit() {
    let allocationStartDate = this.allocationStartDate;
    const formData = new FormData();
    let id = '' + this.req_id;
    formData.append('id', id);
    for (let img of this.fileList1) {
      formData.append('files', img);
    }
    this.http.post<any>('http://localhost:5600/pncFiles', formData).subscribe((res) => {
      for (let i = 0; i < res.files.length; i++) {
        this.filepnc[i] = res.files[i]['filename'];
      }
    });
    let VendorPk = this.pncvendorSelection["rumpvenVendorPK"];
    this.UserDataService.addPncByInitiator(this.allocatedDays, allocationStartDate, this.actualCost, this.req_id, VendorPk, this.filepnc,this.admin_access_id, this.user_name);
    this.route.navigate(['/AmbienceMax/open']);
  }

  onApprove() {
    this.UserDataService.meType = this.currReq.me_type;
    this.route.navigate(['/AmbienceMax/approveRequest', this.req_id]);
  }
  onResend() {
  // this.UserDataService.updateRequest(this.currReq,this.req_id,this.filepath); 
    this.route.navigate(['/AmbienceMax/dialogg/', this.req_id,this.is_pnc]);
  }
  onCompelete() {
    this.UserDataService.addCompleteRequest(this.req_id, this.admin_access_id, this.user_name).subscribe((ResData) => {
      console.log(ResData);
    })
    this.route.navigateByUrl('/AmbienceMax/complete');
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
  download(downloadfile) {
    this.UserDataService. getFiles(downloadfile).subscribe((res) => {
      if (res) {
        const url = window.URL.createObjectURL(this.returnBlob(res));
        FileSaver.saveAs(res, downloadfile);
        // window.open(url);
      }
    });
    return false;
  }
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
