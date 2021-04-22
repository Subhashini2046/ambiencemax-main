import { AddWorkflowDialogComponent } from './../add-workflow-dialog/add-workflow-dialog.component';
import { WorkflowDialogComponent } from './../workflow-dialog/workflow-dialog.component';
import { UserDataService } from './../Services/UserDataService';
import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { MatPaginator,  MatSort,MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material';
import { Router } from '@angular/router';
export interface admin {
  adminPK: number;
  adminIdName: string;
}
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
export class AdminPanelComponent implements OnInit,AfterViewInit {
  Approvers = new FormControl();
  admin: admin;
  adminIdAndName: admin[]=[];
  @ViewChild('singleSelect',{ static: true }) singleSelect: MatSelect;
  public adminIdAndNameCtrl: FormControl = new FormControl();
  public adminIdAndNameFilterCtrl: FormControl = new FormControl();
  public adminIdAndNamefiltered: ReplaySubject<admin[]> = new ReplaySubject<admin[]>(1);
  protected _onDestroy = new Subject<void>();
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
  checkAdmin;
  updateadmin;
  userId;
  checkUserId=346755;
  fetechHierarchy:any[]=[];
  workflowDetails: Workflow[] = [
    // tslint:disable-next-line: max-line-length
  ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private actrouter: ActivatedRoute,private http: HttpClient, private router: Router,private userDataService:UserDataService,public dialog: MatDialog) {
  }
  WorkflowData=[]

  // it will open the dialog that will show workflow details(user name, role,location).
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

  //it will open the dialog for creating the new worlflow.
  openWorkflowDialog(): void {
    let dialogRef = this.dialog.open(AddWorkflowDialogComponent, {width: '1200px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  ngOnInit() {
    this.actrouter.params.subscribe(params => {
      this.userId = +params['userId'];
    });
    
    this.userDataService.getFlow().subscribe((data:any)=>{
      this.dataSource.data=data;
    });

    if(this.userId==this.checkUserId){
    this.userDataService.getAdminIdAndName().subscribe((data:any)=>{
     this.adminIdAndName=data;
      //this.adminIdAndNameCtrl.setValue(this.adminIdAndName);
      
      // load the initial admin list
      this.adminIdAndNamefiltered.next(this.adminIdAndName.slice());
  
      // listen for search field value changes
      this.adminIdAndNameFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.adminIdAndNamefilter();
        });
    })}
  }

// to serach a location etc.
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // add w_flow id and b_id in linkrumprequestinitiators
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

// once the location is selected,it will display all locName in dropdown similarly for others also.
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
  // this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  // protected setInitialValue() {
  //   this.adminIdAndNamefiltered
  //     .pipe(take(1), takeUntil(this._onDestroy))
  //     .subscribe(() => {
  //       this.singleSelect.compareWith = (a: admin, b: admin) => a && b && a.adminPK === b.adminPK;
  //     });
  // }
  protected adminIdAndNamefilter() {
    if (!this.adminIdAndName) {
      return;
    }
    // get the search keyword
    let search = this.adminIdAndNameFilterCtrl.value;
    if (!search) {
      this.adminIdAndNamefiltered.next(this.adminIdAndName.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the banks
    this.adminIdAndNamefiltered.next(
      this.adminIdAndName.filter(admin1 => admin1.adminIdName.toLowerCase().indexOf(search) > -1)

    );
  }

  //check if user has already privilege or not
  onAdminChanged(adminId){
    this.updateadmin=0;
    this.userDataService.adminCheck(adminId).subscribe((data)=>{
    this.checkAdmin=data[0]['admAccess']
    })
  }

  //submit once admin is selected
  onsubmit(){
    this.userDataService.addAdminId(this.adminIdAndNameCtrl.value).subscribe((data:any)=>{    
      alert("Successfully Assigned");
      this.updateadmin=data['result']
    })
    return false;
  }
}
