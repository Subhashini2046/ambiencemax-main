import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
@Component({
  selector: 'app-close',
  templateUrl: './close.component.html',
  styleUrls: ['./close.component.css'],
})
export class CloseComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['reqNumber', 'Request Subject', 'Request Type', 'Requester Id',
    'RequestDate', 'status', 'view'];

  dataSource = new MatTableDataSource();
  members;
  public userId;
  updatedData = [];
  role_id;
  accessId;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(public UserDataService: UserDataService, private changeDetectorRefs: ChangeDetectorRef, private route: Router) { }
  ngOnInit() {
    console.log("Closed Component");
    this.accessId = JSON.parse(localStorage.getItem('admin_access_id'));
    this.role_id = JSON.parse(localStorage.getItem('role_id'));
    return this.UserDataService.getClosedRequest(this.role_id, JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('admin_access_id'))).subscribe((response: any) => {

      this.dataSource.data = response;
    });

  }
  view(req_id, pnc) {
    this.route.navigate(['/main/request-form', req_id, pnc]);
  }
  status(reqId) {
    this.route.navigate(['/main/status', reqId]);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy() {
  }
}
