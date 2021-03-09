import { AddWorkflowDialogComponent } from './../add-workflow-dialog/add-workflow-dialog.component';
import { WorkflowDialogComponent } from './../workflow-dialog/workflow-dialog.component';
import { UserDataService } from './../Services/UserDataService';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator,  MatSort,MatTableDataSource } from '@angular/material';
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
  AppList: string[] = ['Geography','Country', 'State',  'City','Building','Location'];
  displayedColumns: string[] = ['ID','Hierarchy', 'Location','details'];
  approverArray = [];
  workflowToSend = '';
  h_id = '';
  h_name = '';
  work_id = '';
  b_id = '';
  h_level = '';
  onAddlink;
  fetechHierarchy:any[]=[];
  
  workflowDetails: Workflow[] = [
    // tslint:disable-next-line: max-line-length
  ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private http: HttpClient,private userDataService:UserDataService,public dialog: MatDialog) {
  }
  WorkflowData=[]
  openDialog( w_id,w_flow): void {
    this.WorkflowData=w_flow.split(',');
    let dialogRef = this.dialog.open(WorkflowDialogComponent, {width: '550px',
    data: { data: w_id,w_flow:this.WorkflowData}
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
       // w_id.clear();
    });
  }

  openWorkflowDialog(): void {
    let dialogRef = this.dialog.open(AddWorkflowDialogComponent, {width: '1200px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  
  ngOnInit() {
    console.log(this.dataSource);
    this.userDataService.getFlow().subscribe((data:any)=>{
      this.dataSource.data=data;
      console.log(data);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onAddLink() {
    console.log(this.b_id,this.work_id);
    this.userDataService.addLink(this.work_id,this.b_id).subscribe((data)=>{
      this.onAddlink=data["result"]
      console.log(data);
      if(this.onAddlink!=1) {     
      alert("Successfully Added");}
    });
    return false;

  }
  onChanged(event: any) {
    if (event.includes('Location')) {
    this.userDataService.getHierarchy(event).subscribe((res) => {
      this.fetechHierarchy.length=0
      this.onAddlink='';
      this.fetechHierarchy.push(res);
    });}
    else if (event.includes('Building')) {
      this.userDataService.getHierarchy(event).subscribe((res) => {
        this.fetechHierarchy.length=0
        this.onAddlink='';
        this.fetechHierarchy.push(res);
      });}
   else if (event.includes('Cluster')) {
    this.userDataService.getHierarchy(event).subscribe((res) => {
      this.fetechHierarchy.length=0
      this.onAddlink='';
      this.fetechHierarchy.push(res);

    });}
   else if (event.includes('City')) {
    this.userDataService.getHierarchy(event).subscribe((res) => {
      this.fetechHierarchy.length=0
      this.onAddlink='';
      this.fetechHierarchy.push(res);
    });}
   else if (event.includes('State')) {
    this.userDataService.getHierarchy(event).subscribe((res) => {
      this.fetechHierarchy.length=0
      this.onAddlink='';
      this.fetechHierarchy.push(res);
    });}
   else if (event.includes('Country')) {
    this.userDataService.getHierarchy(event).subscribe((res) => {
      this.fetechHierarchy.length=0
      this.onAddlink='';
      this.fetechHierarchy.push(res);
    });}
   else if (event.includes('Geography')) {
    this.userDataService.getHierarchy(event).subscribe((res) => {
      this.fetechHierarchy.length=0
      this.onAddlink='';
      this.fetechHierarchy.push(res);
    }); }

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  onAddHierarchy() {
    this.http.post('http://localhost:3000/addHierarchy', {h_id: this.h_id, h_level: this.h_level , h_name: this.h_name}).subscribe(() => {
      console.log('Sent!!!');
    });
  }

  onAddWork() {
 
  }
}
