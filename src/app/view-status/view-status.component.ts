//import { views1 } from './../Services/UserDataService';
import { Name } from './../../../../../SecondApp/src/app/home';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';
import { MatTableDataSource, MatPaginator, MatSort, throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { getTreeNoValidDataSourceError } from '@angular/cdk/tree';
import { ActivatedRoute } from '@angular/router';


@Component({

  selector: 'app-view-status',
  templateUrl: './view-status.component.html',
  styleUrls: ['./view-status.component.css']
})


export class ViewStatusComponent implements OnInit {
  req_id: any;
  view_id = null;
  view_name = null;
  view_status = null;
  public viewStatus: views1;
  public viewStatus1: views1[] = [];
  displayedColumns: string[] = ['aaction_taken_by', 'req_action', 'req_date', 'req_time'];
  displayedColumns1: string[] = ['id', 'name', 'status'];
  dataSource = new MatTableDataSource();
  dataSource1 = new MatTableDataSource();
  members;
  public userId;
  w_flow: any[] = [];
  role: any[] = [];
  req_level;
  reqStatus;
  initiator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private actrouter: ActivatedRoute, public UsrDataService: UserDataService, private _location: Location) {
  }

  backClicked() {
    this._location.back();
    console.log('goBack()...');

  }
  space
  ngOnInit() {
    this.actrouter.params.subscribe(params => {
      this.req_id = +params['id'];
    });
    this.UsrDataService.getViewRequestStatus(this.req_id).subscribe((res => {
      this.dataSource.data = res.reqLog;
      this.w_flow = res.w_flow;
      this.req_level = res.requestLevel;
      this.initiator = res.intiator_id;
      this.reqStatus = res.reqStatus;
      let j = 0;
      for (let i = 0; i < res.role.length; i++) {
        if((res.role[i][0]==null)){
          this.role[i]=null;
        }
        else{
          this.role[i] = res.role[i][0]["pickRUMPRoleDescription"];}

      }
      for (let i = 0; i < this.w_flow.length; i++) {
        if ((this.req_level.toString().trim() == this.w_flow[i]) &&
          (this.reqStatus.toString().trim() === 'Pending')) {

          for (j; j < i; j++) {
            this.view_id = this.w_flow[j];
            this.view_name = this.role[j];
            this.view_status = "Approved";
            if(this.role[j]==null){this.view_status=null}
            this.viewStatus = {
              id: this.view_id,
              name: this.view_name,
              status: this.view_status
            };
            this.viewStatus1.push(this.viewStatus);
          }
          for (j; j < 8; j++) {
            this.view_id = this.w_flow[j];
            this.view_name = this.role[j];
            this.view_status = "Pending";
            if(this.role[j]==null){this.view_status=null}
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
          if(this.role[i]==null){this.view_status=null}
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
        if(this.role[i]==null){this.view_status=null}
        this.viewStatus = {
          id: this.view_id,
          name: this.view_name,
          status: this.view_status
        };
        this.viewStatus1.push(this.viewStatus);

      }

        
      }
      console.log(this.viewStatus1);
      this.dataSource1.data = this.viewStatus1;
    }));

  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
export interface views1 {
  id: number;
  name: String;
  status: String;
}
