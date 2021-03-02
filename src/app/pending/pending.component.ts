import { Label } from 'ng2-charts';
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ReqSchema } from '../Services/ReqSchema';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css']
})
export class PendingComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['reqNumber', 'Request Subject', 'Request Type', 
    'RequestDate', 'status', 'view','progress'];
  dataSource = new MatTableDataSource();
  members;
  role_id;
  accessId;
  readstatus:any[]=[]
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private route: Router, public UserDataService: UserDataService) { }
  ngOnInit() {
    console.log("pending Component");

    this.accessId = JSON.parse(localStorage.getItem('admin_access_id'));
    this.role_id = JSON.parse(localStorage.getItem('role_id'));
    this.UserDataService.getPendingRequest(this.role_id, JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('admin_access_id'))).subscribe((response: any) => {
      this.dataSource.data= response;
      console.log("//",response)
    });

  }
  view(req_id) {
    this.route.navigate(['/AmbienceMax/view', req_id]);
  }
  status(reqId) {
    this.route.navigate(['/AmbienceMax/status', reqId]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy() {
  }
}
