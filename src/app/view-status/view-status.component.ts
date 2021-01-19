//import { views1 } from './../Services/UserDataService';
import { Name } from './../../../../../SecondApp/src/app/home';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';
import { RequestService } from '../Services/RequestService';
import { MatTableDataSource, MatPaginator, MatSort, throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { getTreeNoValidDataSourceError } from '@angular/cdk/tree';


@Component({

  selector: 'app-view-status',
  templateUrl: './view-status.component.html',
  styleUrls: ['./view-status.component.css'],
  providers: [RequestService]
})


export class ViewStatusComponent implements OnInit {
  main = this.UsrDataService.main;
  view_id=null;
  view_name=null;
  view_status=null;
  public viewStatus:views1;
  public viewStatus1:views1[]=[];
  displayedColumns: string[] = ['aaction_taken_by', 'req_action', 'req_date', 'req_time'];
  displayedColumns1: string[] = ['id', 'name', 'status'];
  dataSource = new MatTableDataSource();
  dataSource1 = new MatTableDataSource();
  members;
  public userId;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public UsrDataService: UserDataService, public requestService: RequestService, private _location: Location) {
  }

  backClicked() {
    this._location.back();
    console.log('goBack()...');

  }
 
  ngOnInit() {
 
   //  console.log("this.viewStatus///",this.viewStatus1);
    console.log(this.UsrDataService.viewReq.req_id);
   // this.dataSource1.data= this.UsrDataService.viewStatus1;
    console.log("this.dataSource1.data",this.dataSource1.data);
    return this.UsrDataService.getViewRequestLog(this.UsrDataService.viewReq.req_id).subscribe((response: any) => {
      console.log(response.req_data['req_date']);
      this.dataSource.data = response.req_data;
      console.log("this.dataSource.data",this.dataSource.data);
      for(let role of this.UsrDataService.role1){
        this.view_id=role.role_id;
         this.view_name=role.role_name;
         if(role.role_id >= this.UsrDataService.viewReq.req_level)
           this.view_status=this.UsrDataService.viewReq.req_status;
         else
           this.view_status="Approved";
        this.viewStatus={
          id:this.view_id,
          name:this.view_name,
          status:this.view_status
        };
        this.viewStatus1.push(this.viewStatus);
        this.dataSource1.data=this.viewStatus1;
       }
    });
    
    
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
 


}
export interface views1{
  id:number;
  name:String;
  status:String;
}
