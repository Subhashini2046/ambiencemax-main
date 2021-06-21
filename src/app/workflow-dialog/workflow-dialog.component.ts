import { UserDataService } from '../Services/UserDataService';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-workflow-dialog',
  templateUrl: './workflow-dialog.component.html',
  styleUrls: ['./workflow-dialog.component.css']
})
export class WorkflowDialogComponent implements OnInit {
  WorkflowData;
  WorkflowData1 = [];
  wflowId;
  workflow1 = [];
  displayedColumns: string[] = ['name', 'role', 'location'];
  dataSource = new MatTableDataSource();
  //MatTableDataSource
  members;
  indexOfInitiator;
  w_flow = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(public dialogRef: MatDialogRef<WorkflowDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userDataService: UserDataService) {
    this.WorkflowData = data;
    this.wflowId = this.WorkflowData.data
    this.w_flow = data.w_flow;
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
  indexCivil;
  indexElectrical;
  w_flowData: any[] = [];
  ngOnInit() {
    //get w_flow details
    let initiatorIndex = 0;
    this.userDataService.getFlowDetails(this.WorkflowData).subscribe((res: any) => {
      for (let i = 0; i < this.w_flow.length; i++) {
        if (this.w_flow[i].includes('or')) {
          let val1 = this.w_flow.filter(data => data.includes('c')).map(data => {
            return data.split('or').filter(data => data.includes('c')).map(data => data.replace('c', ''))[0]
          });
          this.workflow1.push(val1[0]);
          // get index of Electrical from w_flow
          let val2 = this.w_flow.filter(data => data.includes('e')).map(data => {
            return data.split('or').filter(data => data.includes('e')).map(data => data.replace('e', ''))[0]
          });
          this.workflow1.push(val2[0]);
        }
        else
          this.workflow1.push(this.w_flow[i]);
      }
      if (this.workflow1.includes('i')) {
        initiatorIndex = this.workflow1.indexOf('i');
        for (let i = 0; i < initiatorIndex; i++) {

          this.w_flowData.push(res[i]);
        }
        this.w_flowData.push({ adminName: " ", id: 'i', role: "Initiator", name: " " });
        for (let i = initiatorIndex; i < res.length; i++) {
          this.w_flowData.push(res[i]);
        }
      }
      else{
        this.w_flowData=res;
      }

      for (let i = 0; i < this.workflow1.length; i++) {
        for (let j = 0; j < this.w_flowData.length; j++) {
          if (this.workflow1[i] == this.w_flowData[j]['id']) {
            this.WorkflowData1.push(this.w_flowData[j])
            break;
          }
        }
      }
    
      // get index of Civil from w_flow
      this.indexCivil = this.w_flow.filter(data => data.includes('c')).map(data => {
        return data.split('or').filter(data => data.includes('c')).map(data => data.replace('c', ''))[0]
      });

      // get index of Electrical from w_flow
      this.indexElectrical = this.w_flow.filter(data => data.includes('e')).map(data => {
        return data.split('or').filter(data => data.includes('e')).map(data => data.replace('e', ''))[0]
      });
      this.dataSource.data = this.WorkflowData1;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
