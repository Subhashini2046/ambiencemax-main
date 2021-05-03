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
wflowId;
workflow1=[];
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
      this.WorkflowData=data;
      this.wflowId=this.WorkflowData.data
      this.w_flow=data.w_flow;
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
    indexCivil;
    indexElectrical;
  w_flowData:any[]=[];
  ngOnInit() {
 // console.log("uu",this.w_flowData);
    //get w_flow details
    this.userDataService.getFlowDetails(this.WorkflowData).subscribe((res:any)=>{
       // get index of Initiator from w_flow
       console.log(this.w_flow);
       for(let i=0;i<this.w_flow.length;i++){
         if(this.w_flow[i].includes('or')){
          // get index of Civil from w_flow
      let val1= this.w_flow.filter(data => data.includes('c')).map(data => {
        return data.split('or').filter(data => data.includes('c')).map(data => data.replace('c', ''))[0]
      });
this.workflow1.push(val1[0]);
       // get index of Electrical from w_flow
      let val2=this.w_flow.filter(data => data.includes('e')).map(data => {
        return data.split('or').filter(data => data.includes('e')).map(data => data.replace('e', ''))[0]
      });
      this.workflow1.push(val2[0]);
         }
         else
          this.workflow1.push(this.w_flow[i]);
       }
       res.push({adminName: " ", id: 0, role: "Initiator", name: " "})
       console.log(res);
       console.log(this.workflow1);
       for(let i=0;i<this.workflow1.length;i++){
         if(this.workflow1[i]!='i' && res[i]['id']!=0){
          console.log("ress",res[i]['id']); 
           this.w_flowData.push(res[i])
      }
         if(this.workflow1[i]=='i'){
          this.w_flowData.push({adminName: " ", id: 0, role: "Initiator", name: " "});
         }
 
       }
      // this.w_flowData.slice(8,1)
       console.log("i",this.w_flowData); 
      // this.indexOfInitiator= this.w_flow.indexOf('i');
      // for(let i=0;i<this.indexOfInitiator+1;i++){
      //   this.w_flowData[i]=res[i];}

      // this.w_flowData.push({adminName: " ", id: null, role: "Initiator", name: " "});

      // for(let i=this.indexOfInitiator+1;i<this.indexOfInitiator+4;i++){
      //   console.log("i",i);
      //   this.w_flowData[i+1]=res[i];
      // }

      // get index of Civil from w_flow
      this.indexCivil= this.w_flow.filter(data => data.includes('c')).map(data => {
        return data.split('or').filter(data => data.includes('c')).map(data => data.replace('c', ''))[0]
      });

       // get index of Electrical from w_flow
      this.indexElectrical=this.w_flow.filter(data => data.includes('e')).map(data => {
        return data.split('or').filter(data => data.includes('e')).map(data => data.replace('e', ''))[0]
      });
      this.dataSource.data=this.w_flowData;
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
