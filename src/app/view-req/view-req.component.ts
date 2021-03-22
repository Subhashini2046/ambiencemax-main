
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import * as FileSaver from 'file-saver';
import { MatTableDataSource, MatSort } from '@angular/material';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

@Component({
  selector: 'app-view-req',
  templateUrl: './view-req.component.html',
  styleUrls: ['./view-req.component.css']
})
export class ViewReqComponent implements OnInit {
  @ViewChild('divId1', { static: false }) divId1: ElementRef;

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
  dataSource2 = new MatTableDataSource();
  dataSource3: any[] = [];
  dataSource: any[] = [];
  selectedElement: any[] = [];
  constructor(private actrouter: ActivatedRoute, public userDataService: UserDataService, private route: Router, private router: Router, public snackBar: MatSnackBar) {
  }
  filestage;
  fileName = [];
  BoqfileName = [];
  selectedSpoc;
  RequestAllocatedVendor;
  reqComment;
  pncSupportingDoc = [];


  pdfTableData: any[] = [];
  view_Status: any[] = [];
  spoc: any[] = [];
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
      for (let i = 0; i < response.length; i++) {
        if (response[i].RUMPRequestFilesStage == 1) {
          this.fileName.push(response[i].RUMPRequestFilesPath.replace(/^.*[\\\/]/, ''));
          console.log(this.fileName);
        }
        if (response[i].RUMPRequestFilesStage == 2) {
          this.BoqfileName.push(response[i].RUMPRequestFilesPath.replace(/^.*[\\\/]/, ''));
        }
        if (response[i].RUMPRequestFilesStage == 3) {
          this.pncSupportingDoc.push(response[i].RUMPRequestFilesPath.replace(/^.*[\\\/]/, ''));
        }
      }
    });

    this.userDataService.getRequestDetail(this.req_id).subscribe((response: any) => {
      this.userDataService.getSpocDetails(this.req_id).subscribe((response: any) => {
        this.dataSource = response;
        this.selectedElement = response;
        this.selectedSpoc = this.dataSource.length;
        console.log(response);
      });
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
      console.log(this.RequestAllocatedVendor,"v");
      // if (this.RequestAllocatedVendor != null) {
      //   this.userDataService.getSpocDetails(this.req_id).subscribe((response: any) => {
      //     for (let i = 0; i < response.length; i++) {
      //       if (this.RequestAllocatedVendor == response[i]['rumpvenVendorPK']) {
      //         this.dataSource3.push(response[i]);
      //       }
      //     }
      //   });
      // }
      //console.log(this.req_number.substr(12,15),"n")
      this.reqComment = response[0]["requestComments"];
      console.log(this.reqComment);
      this.pncurl = response[0]["PNCUrl"];
      if (this.pncurl != null) {
        this.filename = response[0]["PNCUrl"].replace(/^.*[\\\/]/, '');
      }
      if (this.req_status.toString().trim() != 'Pending') {
        this.userDataService.check_asRead(this.req_id).subscribe((response: any) => {
          console.log(response, "check_asRead");
        });
      }
    });
    if (this.RequestAllocatedVendor != null) {
      this.userDataService.getSpocDetails(this.req_id).subscribe((response: any) => {
        for (let i = 0; i < response.length; i++) {
          if (this.RequestAllocatedVendor == response[i]['rumpvenVendorPK']) {
            this.spoc[0] = response[i]['venName'];
            this.spoc[1] = response[i]['venSpoc1'];
            this.spoc[2] = response[i]['venSpoc2'];
            this.spoc[3] = response[i]['venSpoc3'];
          }
        }
      });
    }

  }
  returnBlob(res): Blob {
    console.log('file downloaded');
    return new Blob([res], { type: 'pdf' });
  }

  // download request,BOQ and PNC supporting file
  download(downloadfile) {
    this.userDataService.getFiles(downloadfile).subscribe((res) => {
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
    this.userDataService.addCompleteRequest(this.req_id, this.accessID, this.user_name).subscribe((ResData) => {
      console.log(ResData);
    })
    this.route.navigateByUrl('/AmbienceMax/close');
  }
  downloadPDF() {
    this.route.navigate(['/AmbienceMax/pdf', this.req_id]);
  }

  // formate the date
  dateFormate(date) {
    let sDate = date.toString();
    let newDate = sDate.slice(0, 10) + " " + sDate.slice(11, 21);
    return newDate;

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
    this.userDataService.getpdfTableData(this.req_id).subscribe((res: any) => {
      this.pdfTableData = res;
      const doc = new jsPDF('p', 'pt', 'a4');
      autoTable(doc, { html: '#my-table' })
      const columns1 = [[this.req_number.slice(12, 17)]];
      const data2 = [];
      const columns3 = [[""]];

      data2.push(["Request No: " + this.req_number + "             " + "Date: " + this.dateFormate(this.pdfTableData[0].actionTiming)]);
      data2.push(["SWON / WON : " + this.req_swon + "             " + "Budget: " + this.budget_type]);
      data2.push(["Available(INR): " + this.available_budget + "             " + "Consumed(INR): " + this.consumed_budget + "             " + "Balance(INR): " + this.balance_budget]);
      data2.push(["Subject: " + this.req_subject]);
      data2.push(["Description: " + this.req_description]);

      let adspace1 = this.space("Initiator: User Dept/ Admin" + "               " + "Name: " + this.pdfTableData[0].user);
      data2.push(["Initiator: User Dept/ Admin" + "               " + "Name: " + this.pdfTableData[0].user + adspace1
        + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[0].actionTiming)])

      let lspace1 = this.space("Recommender: Local Administration." + "               " + "Name: " + this.pdfTableData[1].user);
      data2.push(["Recommender: Local Administration." + "               " + "Name: " + this.pdfTableData[1].user + lspace1
        + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[1].actionTiming)])

      let cspace1 = this.space("From : Cluster Head" + "               " + "Name: " + this.pdfTableData[2].user);
      data2.push(["From : Cluster Head" + "               " + "Name: " + this.pdfTableData[2].user + cspace1
        + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[2].actionTiming)])
      data2.push(columns3);
      let espace1 = this.space("From : Engineer" + "               " + "Name: " + this.pdfTableData[3].user);

      data2.push(["From : Engineer" + "               " + "Name: " + this.pdfTableData[3].user + espace1
        + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[3].actionTiming)])
      data2.push(["Description: " + this.boqDescription])
      data2.push(["Estimated cost for the work(INR): " + this.boqEstimatedCost])
      data2.push(["Estimated time for the work: " + this.boqEstimatedTime])
      data2.push([""]);

      let hspace1 = this.space("From : Head of Maintenance" + "               " + "Name: " + this.pdfTableData[4].user);

      data2.push(["From : Head of Maintenance" + "               " + "Name: " + this.pdfTableData[4].user + hspace1
        + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[4].actionTiming)])
      data2.push([""]);

      let ispace1 = this.space("From : Initiator" + "               " + "Name: " + this.pdfTableData[0].user);

      data2.push(["From : Initiator" + "               " + "Name: " + this.pdfTableData[0].user + ispace1
        + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[0].actionTiming)])

      data2.push(["Actual Cost(INR): " + this.actualCost]);
      data2.push([""]);

      let bspace1 = this.space("From: Branch PMO" + "               " + "Name: " + this.pdfTableData[5].user);

      data2.push(["From: Branch PMO" + "               " + "Name: " + this.pdfTableData[5].user + bspace1
        + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[5].actionTiming)])
      let aspace1 = this.space("Approved by: Administration Head" + "               " + "Name: " + this.pdfTableData[6].user);

      data2.push(["Approved by: Administration Head" + "               " + "Name: " + this.pdfTableData[6].user + aspace1
        + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[6].actionTiming)])

      let cespace1 = this.space("Approved by: Administration Head" + "               " + "Name: " + this.pdfTableData[6].user);

      data2.push(["Approved by: Centre Head" + "               " + "Name: " + this.pdfTableData[7].user + cespace1
        + "Signature:________________   " + "Date: " + this.dateFormate(this.pdfTableData[7].actionTiming)])

      autoTable(doc, {
        head: columns1,
        theme: 'grid',
        columnStyles: { 4: { cellPadding: 2 }, columns3: { fillColor: "black" } },
        body: data2,
        tableLineColor: 200,
        styles: { fontSize: 12, textColor: 20, font: "times" },
        didParseCell: function (data) {
          if (data.row.index === 8) {
            data.cell.styles.fillColor = [62, 172, 148];
          }
          if (data.row.index === 5) {
            data.cell.styles.fontStyle = "bold"
          }
          if (data.row.index === 6) {
            data.cell.styles.fontStyle = "bold"
          }
          if (data.row.index === 7) {
            data.cell.styles.fontStyle = "bold"
          }
          if (data.row.index === 9) {
            data.cell.styles.fontStyle = "bold"
          }
          if (data.row.index === 14) {
            data.cell.styles.fontStyle = "bold"
          }
          if (data.row.index === 16) {
            data.cell.styles.fontStyle = "bold"
          }
          if (data.row.index === 19) {
            data.cell.styles.fontStyle = "bold"
          }
          if (data.row.index === 20) {
            data.cell.styles.fontStyle = "bold"
          }
          if (data.row.index === 21) {
            data.cell.styles.fontStyle = "bold"
          }

          if (data.row.index === 13) {
            data.cell.styles.fillColor = [62, 172, 148];
          }
          if (data.row.index === 15) {
            data.cell.styles.fillColor = [62, 172, 148];
          }
          if (data.row.index === 18) {
            data.cell.styles.fillColor = [62, 172, 148];
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

}

export interface views1 {
  id: number;
  name: String;
  status: String;
}