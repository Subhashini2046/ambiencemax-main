import { UserDataService } from '../Services/UserDataService';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-workflow-dialog',
  templateUrl: './workflow-dialog.component.html',
  styleUrls: ['./workflow-dialog.component.css']
})
export class WorkflowDialogComponent implements OnInit {
WorkflowData;

displayedColumns: string[] = ['name', 'role', 'location'];
dataSource = new MatTableDataSource();
//MatTableDataSource
  members;
  indexOfInitiator;
    w_flow=[];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor( public dialogRef: MatDialogRef<WorkflowDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private userDataService:UserDataService) { 
      console.log(data["w_flow"]);
      this.WorkflowData=data;
      this.w_flow=data["w_flow"];
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
    indexCivil;
    indexElectrical;
  w_flowData:any[]=[];
  ngOnInit() {
    console.log(this.WorkflowData,"jj");

    this.userDataService.getFlowDetails(this.WorkflowData).subscribe((res:any)=>{
      this.indexOfInitiator= this.w_flow.indexOf('i');
      for(let i=0;i<this.indexOfInitiator+1;i++){
        this.w_flowData[i]=res[i];
      }
      this.w_flowData.push({adminName: " ", id: null, role: "Initiator", name: " "});
      for(let i=this.indexOfInitiator+1;i<this.indexOfInitiator+4;i++){
        this.w_flowData[i+1]=res[i];
      }
      console.log(this.w_flowData);
      this.indexCivil= this.w_flow.filter(data => data.includes('c')).map(data => {
        return data.split('or').filter(data => data.includes('c')).map(data => data.replace('c', ''))[0]
      });
      this.indexElectrical=this.w_flow.filter(data => data.includes('e')).map(data => {
        return data.split('or').filter(data => data.includes('e')).map(data => data.replace('e', ''))[0]
      });
      this.dataSource.data=this.w_flowData;
      console.log(this.indexCivil[0],this.indexElectrical[0]);
      console.log(this.dataSource.data);
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
