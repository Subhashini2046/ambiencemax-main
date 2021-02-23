import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ReqSchema } from '../Services/ReqSchema';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-open',
  templateUrl: './open.component.html',
  styleUrls: ['./open.component.css'],
})
export class OpenComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['reqNumber', 'Request Subject', 'Request Type', 'Requester Id',
    'RequestDate', 'status', 'view', 'Approve'];

  dataSource = new MatTableDataSource();
  members;
  public openRequests: ReqSchema[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private http: HttpClient, public UserDataService: UserDataService, private changeDetectorRefs: ChangeDetectorRef, private route: Router) { }
  ngOnInit() {
    console.log("Open Component");
    return this.UserDataService.getOpenRequest(JSON.parse(localStorage.getItem('role_id')), JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('admin_access_id'))).subscribe((response: any) => {
      console.log(response);
      this.dataSource.data = response
    });

  }
  view(req_id, pnc) {
    this.route.navigate(['/main/request-form', req_id, pnc]);
  }
  status(reqId) {
    this.route.navigate(['/main/status', reqId]);
  }

  update(req_id) {
    this.route.navigate(['/main/update', req_id]);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
  }
}
