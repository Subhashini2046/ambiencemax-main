import { WorkflowDialogComponent } from './../workflow-dialog/workflow-dialog.component';
import { UserDataService } from './../Services/UserDataService';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';

export interface Workflow {
  id: number;
  flow: string;
  location: string;
}
@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  Approvers = new FormControl();
  AppList: string[] = [ 'Location Head', 'Cluster Head', 'City Head', 'State Head', 'Country Head', 'Geography Head'];
  displayedColumns: string[] = ['ID', 'Flow', 'Location','details'];
  approverArray = [];
  workflowToSend = '';
  h_id = '';
  h_name = '';
  work_id = '';
  b_id = '';
  h_level = '';
  workflowDetails: Workflow[] = [
    // tslint:disable-next-line: max-line-length
  ];
  dataSource;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private http: HttpClient,private userDataService:UserDataService,public dialog: MatDialog) {
    // http.get<{data: any[]}>('http://localhost:3000/getFlow').subscribe((ResData) => {
    //   console.log(ResData);
    //   ResData.data.forEach((e) => {
    //     this.workflowDetails.push({
    //       id: e.w_id,
    //       flow: e.w_flow,
    //       location: e.h_name
    //     });
    //   });
    //   this.dataSource = new MatTableDataSource(this.workflowDetails);
    //   this.dataSource.paginator = this.paginator;
    // });
    // console.log(this.workflowDetails);
  }
  openDialog(w_flow): void {
    let dialogRef = this.dialog.open(WorkflowDialogComponent, {width: '250px',
    data: { data: w_flow}
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    //  this.animal = result;
    });
  }
  ngOnInit() {
    console.log(this.dataSource);
    this.userDataService.getFlow().subscribe((data)=>{
      this.dataSource=data;
      console.log(data);
    });
  }
  onAddLink() {
    this.userDataService.addLink(this.work_id,this.b_id).subscribe((data)=>{
      console.log('Successfully Added');
    });
    // this.http.post('http://localhost:3000/addLink', {work_id: this.work_id, b_id: this.b_id}).subscribe(() => {
    //   console.log('Sent!!!');
    // });
    
    console.log(this.work_id,this.b_id);
    this.work_id = '';
    this.b_id = '';

  }
  onAddHierarchy() {
    this.http.post('http://localhost:3000/addHierarchy', {h_id: this.h_id, h_level: this.h_level , h_name: this.h_name}).subscribe(() => {
      console.log('Sent!!!');
    });
    this.h_id = '';
    this.h_level = '';
    this.h_name = '';
  }
  onAddWork() {
    if (this.approverArray.includes('Location Head')) {
      this.workflowToSend = this.workflowToSend.concat('2');
    }
    if (this.approverArray.includes('Cluster Head')) {
      if (this.workflowToSend === '') {
        this.workflowToSend = this.workflowToSend.concat('3');
      } else {
        this.workflowToSend = this.workflowToSend.concat(',3');
      }
    }
    if (this.approverArray.includes('City Head')) {
      if (this.workflowToSend === '') {
        this.workflowToSend = this.workflowToSend.concat('4');
      } else {
        this.workflowToSend = this.workflowToSend.concat(',4');
      }
    }
    if (this.approverArray.includes('State Head')) {
      if (this.workflowToSend === '') {
        this.workflowToSend = this.workflowToSend.concat('5');
      } else {
        this.workflowToSend = this.workflowToSend.concat(',5');
      }
    }
    if (this.approverArray.includes('Country Head')) {
      if (this.workflowToSend === '') {
        this.workflowToSend = this.workflowToSend.concat('6');
      } else {
        this.workflowToSend = this.workflowToSend.concat(',6');
      }
    }
    if (this.approverArray.includes('Geography Head')) {
      if (this.workflowToSend === '') {
        this.workflowToSend = this.workflowToSend.concat('7');
      } else {
        this.workflowToSend = this.workflowToSend.concat(',7');
      }
    }
    console.log(this.workflowToSend);
    this.http.post('http://localhost:3000/setFlow', {wflow: this.workflowToSend}).subscribe(() => {
      console.log('sent');
    });
    this.workflowToSend = '';
    this.approverArray = this.approverArray.splice(0, -1);
    console.log(this.approverArray);
  }
}
