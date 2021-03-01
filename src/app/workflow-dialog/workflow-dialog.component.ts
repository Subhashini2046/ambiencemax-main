import { UserDataService } from './../Services/UserDataService';
import { Workflow } from './../admin-panel/admin-panel.component';

import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-workflow-dialog',
  templateUrl: './workflow-dialog.component.html',
  styleUrls: ['./workflow-dialog.component.css']
})
export class WorkflowDialogComponent implements OnInit {
WorkflowData;
  constructor( public dialogRef: MatDialogRef<WorkflowDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private userDataService:UserDataService) { 
      console.log(data);
      this.WorkflowData=data;
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
  ngOnInit() {
    console.log(this.WorkflowData);
    this.userDataService.getFlowDetails(this.WorkflowData).subscribe((data)=>{
      console.log(data);
    });
  }

}
