
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { Location } from '@angular/common';
import { MatTableDataSource, MatSort} from '@angular/material';
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
  public viewStatus: Views;
  public viewStatus1: Views[] = [];
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
  is_pnc;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private actrouter: ActivatedRoute, public UsrDataService: UserDataService, private _location: Location) {
  }

  backClicked() {
    this._location.back();
  }
  space
  ngOnInit() {
    
    this.actrouter.params.subscribe(params => {
      this.req_id = +params['id'];
    });

    //get reuqest log and request status
    this.UsrDataService.getViewRequestStatus(this.req_id).subscribe((res => {
      this.dataSource.data = res.reqLog;
      this.w_flow = res.w_flow;
      this.req_level = res.requestLevel;
      this.initiator = res.intiator_id;
      this.reqStatus = res.reqStatus;
      this.is_pnc=res.ispnc;
      let j = 0;
      for (let i = 0; i < res.role.length; i++) {
        if ((res.role[i][0] == null)) {
          this.role[i] = null;
        }
        else {
          this.role[i] = res.role[i][0]["pickRUMPRoleDescription"];
        }

      }
      for (let i = 0; i < this.w_flow.length; i++) {
        if ((this.req_level.toString().trim() == this.w_flow[i]) &&
          (this.reqStatus.toString().trim() === 'Pending')) {

            if(!(this.initiator==this.req_level && this.is_pnc==0)){

              for (j; j < i; j++) {
                this.view_id = this.w_flow[j];
                this.view_name = this.role[j];
                this.view_status = "Approved";
                if (this.role[j] == null) { this.view_status = null }
                this.viewStatus = {
                  id: this.view_id,
                  name: this.view_name,
                  status: this.view_status
                };
                this.viewStatus1.push(this.viewStatus);
              }
            }
              for (j; j < this.w_flow.length; j++) {
                this.view_id = this.w_flow[j];
                this.view_name = this.role[j];
                this.view_status = "Pending";
                if (this.role[j] == null) { this.view_status = null }
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
          if (this.role[i] == null) { this.view_status = null }
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
          if (this.role[i] == null) { this.view_status = null }
          this.viewStatus = {
            id: this.view_id,
            name: this.view_name,
            status: this.view_status
          };
          this.viewStatus1.push(this.viewStatus);
     
        }
      }
   
      for(let i=0;i<this.viewStatus1.length;i++){
        if (this.viewStatus1[i]["name"] == null) {
          this.viewStatus1.splice(i, 1);
        }
      }
      this.dataSource1.data = this.viewStatus1;
    }));
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
export interface Views {
  id: number;
  name: string;
  status: string;
}
