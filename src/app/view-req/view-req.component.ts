import { ExportRequestPdfComponent } from './../export-request-pdf/export-request-pdf.component';
import { Subject } from 'rxjs';
import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import * as FileSaver from 'file-saver';
import { MatTableDataSource, MatSort} from '@angular/material';
import jspdf from 'jspdf';
//declare var jspdf: any;
import html2canvas from 'html2canvas';
// declare var require: any
// const FileSaver = require('file-saver');
@Component({
  selector: 'app-view-req',
  templateUrl: './view-req.component.html',
  styleUrls: ['./view-req.component.css']
})
export class ViewReqComponent implements OnInit {
  @ViewChild('divId1', {static: false}) divId1: ElementRef;

  // @ViewChild(ExportRequestPdfComponent,{ static: false }) ElementRef;
  // private childComponentParent: ExportRequestPdfComponent;

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
  displayedColumns = ['selected', 'Vendor Name', 'spoc1', 'spoc2', 'spoc3'];
  displayedColumn3 = ['Vendor Name', 'spoc1', 'spoc2', 'spoc3'];
  displayedColumns2: string[] = ['aaction_taken_by', 'req_action', 'req_date', 'req_time'];
  displayedColumns1: string[] = ['id', 'name', 'status'];
  dataSource1 = new MatTableDataSource();
  dataSource2= new MatTableDataSource();
  dataSource3:any[] = [];
  dataSource: any[] = [];
  selectedElement: any[] = [];
  constructor(private actrouter: ActivatedRoute, public userDataService: UserDataService, private route: Router, private router: Router, public snackBar: MatSnackBar) {
  }
  filestage;
  fileName=[];
BoqfileName=[];
selectedSpoc;
RequestAllocatedVendor;
reqComment;
pncSupportingDoc=[];


view_id = null;
view_name = null;
view_status = null;
public viewStatus: views1;
public viewStatus1: views1[] = [];
w_flow: any[] = [];
role: any[] = [];
req_level;
reqStatus;
initiator;
is_pnc;
  ngOnInit() {
    this.actrouter.params.subscribe(params => {
      this.req_id = +params['id'];
      console.log('this.req_id ', this.req_id, this.resendToId);
    });
    this.user_name = JSON.parse(localStorage.getItem('user_name'));
    this.accessID = JSON.parse(localStorage.getItem('admin_access_id'));
    this.role_id = JSON.parse(localStorage.getItem('role_id'));

    //get reuqest file
    this.userDataService.getRequestFile(this.req_id).subscribe((response: any) => {
      for(let i=0;i<response.length;i++){
        if(response[i].RUMPRequestFilesStage==1){
          this.fileName.push(response[i].RUMPRequestFilesPath.replace(/^.*[\\\/]/, ''));
          console.log(this.fileName);
        }
        if(response[i].RUMPRequestFilesStage==2){
          this.BoqfileName.push(response[i].RUMPRequestFilesPath.replace(/^.*[\\\/]/, ''));
        }
        if(response[i].RUMPRequestFilesStage==3){
          this.pncSupportingDoc.push(response[i].RUMPRequestFilesPath.replace(/^.*[\\\/]/, ''));
        }
      }
    });
    
    this.userDataService.getSpocDetails(this.req_id).subscribe((response: any) => {
      this.dataSource = response;
      this.selectedElement = response;
      this.selectedSpoc = this.dataSource.length;
      console.log(response);
    });
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
      this.RequestAllocatedVendor = response[0]["RequestAllocatedVendor"];
      if(this.RequestAllocatedVendor!=null){
        this.userDataService.getSpocDetails(this.req_id).subscribe((response: any) => {
          for(let i=0;i<response.length;i++){
            if(this.RequestAllocatedVendor==response[i]['rumpvenVendorPK']){
              this.dataSource3.push(response[i]);
            }
          }
        });
      }
      this.reqComment=response[0]["requestComments"];
      console.log( this.reqComment);
      this.pncurl = response[0]["PNCUrl"];
      if(this.pncurl!=null){
       this.filename = response[0]["PNCUrl"].replace(/^.*[\\\/]/, '');}
      if(this.req_status.toString().trim()!='Pending'){
        this.userDataService.check_asRead(this.req_id).subscribe((response: any) => {
          console.log(response,"check_asRead");
        });}
    });




    this.userDataService.getViewRequestStatus(this.req_id).subscribe((res) => {
      this.dataSource2.data = res.reqLog;
      this.w_flow = res.w_flow;
      this.req_level = res.requestLevel;
      this.initiator = res.intiator_id;
      this.reqStatus = res.reqStatus;
      this.is_pnc=res.ispnc;
      let j = 0;
      for (let i = 0; i < res.role.length; i++) {
        if ((res.role[i][0] == null)) {
          this.role[i] = null;
        }
        else {
          this.role[i] = res.role[i][0]["pickRUMPRoleDescription"];
        }

      }
      for (let i = 0; i < this.w_flow.length; i++) {
        if ((this.req_level.toString().trim() == this.w_flow[i]) &&
          (this.reqStatus.toString().trim() === 'Pending')) {

            if(!(this.initiator==this.req_level && this.is_pnc==0)){

              for (j; j < i; j++) {
                this.view_id = this.w_flow[j];
                this.view_name = this.role[j];
                this.view_status = "Approved";
                if (this.role[j] == null) { this.view_status = null }
                this.viewStatus = {
                  id: this.view_id,
                  name: this.view_name,
                  status: this.view_status
                };
                this.viewStatus1.push(this.viewStatus);
              }
            }
              for (j; j < this.w_flow.length; j++) {
                this.view_id = this.w_flow[j];
                this.view_name = this.role[j];
                this.view_status = "Pending";
                if (this.role[j] == null) { this.view_status = null }
                this.viewStatus = {
                  id: this.view_id,
                  name: this.view_name,
                  status: this.view_status
                };
                this.viewStatus1.push(this.viewStatus);
              }
            

        }
        if ((this.req_level == this.initiator) &&
          (this.reqStatus.toString().trim() === 'Closed')) {
          this.view_id = this.w_flow[i];
          this.view_name = this.role[i];
          this.view_status = "Approved";
          if (this.role[i] == null) { this.view_status = null }
          this.viewStatus = {
            id: this.view_id,
            name: this.view_name,
            status: this.view_status
          };
          this.viewStatus1.push(this.viewStatus);

        }
        if ((this.req_level == this.initiator) &&
          (this.reqStatus.toString().trim() === 'Completed')) {

          this.view_id = this.w_flow[i];
          this.view_name = this.role[i];
          this.view_status = "Approved";
          if (this.role[i] == null) { this.view_status = null }
          this.viewStatus = {
            id: this.view_id,
            name: this.view_name,
            status: this.view_status
          };
          this.viewStatus1.push(this.viewStatus);
          console.log( this.viewStatus1);
        }
      }
      console.log( this.viewStatus1);
      for(let i=0;i<this.viewStatus1.length;i++){
        if (this.viewStatus1[i]["name"] == null) {
          this.viewStatus1.splice(i, 1);
        }
      }
      this.dataSource1.data = this.viewStatus1;

    });
  }
  returnBlob(res): Blob {
    console.log('file downloaded');
    return new Blob([res], { type: 'pdf' });
  }

  // download request,BOQ and PNC supporting file
  download(downloadfile) {
    this.userDataService. getFiles(downloadfile).subscribe((res) => {
      if (res) { 
        const url = window.URL.createObjectURL(this.returnBlob(res));
        FileSaver.saveAs(res, downloadfile);
      } 
    }); 
    return false;
  }

  // download PNC file
  downloadFile() {
    this.userDataService.downloadFile(this.filename).subscribe((res) => {
      if (res) {
        const url = window.URL.createObjectURL(this.returnBlob(res));
        FileSaver.saveAs(res, this.filename);
      }
    });
    return false;
  }

  // Mark request status as Complete
  onCompelete() {
    this.userDataService.addCompleteRequest(this.req_id,this.accessID, this.user_name).subscribe((ResData) => {
      console.log(ResData);
    })
    this.route.navigateByUrl('/AmbienceMax/close');
  }
  downloadPDF(){
    this.route.navigate(['/AmbienceMax/pdf', this.req_id]);
  }

  ExportPDF()  
  {  
   // this.childComponentParent.captureScreen();
    let contentDataURL2;
    let imgHeight2;
    let contentDataURL3;
    let imgHeight3;
    var data = document.getElementById('divId1'); 
   var data1 = document.getElementById('divId2');
   var data2 = document.getElementById('divId3');
  // html2canvas(data).then(canvas => {  
  //     let imgWidth = 208;     
  //     imgHeight2 = canvas.height * imgWidth / canvas.width;  
  //     contentDataURL2 = canvas.toDataURL('image/png') 
  //   });
  //   html2canvas(data2).then(canvas => {  
  //     let imgWidth = 208;     
  //     imgHeight3 = canvas.height * imgWidth / canvas.width;  
  //     contentDataURL3 = canvas.toDataURL('image/png') 
  //   }); 
    
  //   html2canvas(data1).then(canvas => {   
  //     let imgWidth = 208;   
  //     let imgHeight = canvas.height * imgWidth / canvas.width;   
  //     const contentDataURL = canvas.toDataURL('image/png')  
  //     let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
  //     let position = 0; 
  //     pdf.addImage(contentDataURL2, 'PNG', 0, position, imgWidth, imgHeight2)
  //     pdf.addPage();
  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
  //     pdf.addPage();
  //     pdf.addImage(contentDataURL3, 'PNG', 0, position, imgWidth, imgHeight3)
  //     pdf.save('MYPdf.pdf');   
  //   }); 
  const content = this.divId1.nativeElement;
  console.log(content);
  // html2canvas(content, <Html2Canvas.Html2CanvasOptions>{
  //   onrendered: function(canvas: HTMLCanvasElement) {
  //     var pdf = new jspdf('p','pt','a4');    
  //     var img = canvas.toDataURL("image/png");
  //     pdf.addImage(img, 'PNG', 10, 10, 580, 300);
  //     pdf.save('web.pdf');
  //   }
  // });

    // html2canvas(content).then(canvas => {    
    //   let imgWidth = 208;  
    //   let imgHeight = canvas.height * imgWidth / canvas.width; 
    //   console.log(data);  
    //   console.log(canvas); 
    //   const contentDataURL = canvas.toDataURL('image/png');  
    //   let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
    //   let position = 0; 
    // pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)

    //   pdf.save('MYPdf.pdf');    
    // }); 
    
    let options : any = {
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      };
      
    let doc = new jspdf(options);
    doc.setFontSize(10);
    doc.setFont("sans-serif");
    doc.html(content.innerHTML, {
      callback: function (doc) {
            doc.save("angular-demo.pdf");
          },
      margin:0, 
      x: 0, 
      y: 0, 
    });
  
   return false;
  }  

}

export interface views1 {
  id: number;
  name: String;
  status: String;
}