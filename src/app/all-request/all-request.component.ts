import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
@Component({
  selector: 'app-all-request',
  templateUrl: './all-request.component.html',
  styleUrls: ['./all-request.component.css'],
})
export class AllRequestComponent implements OnInit {
  displayedColumns: string[] = ['reqNumber', 'Request Subject', 'Request Type', 'Requester Id',
    'RequestDate', 'status', 'view', 'Approve'];
  dataSource = new MatTableDataSource();


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private route: Router, public UserDataService: UserDataService, private changeDetectorRefs: ChangeDetectorRef) { }
  ngOnInit() {
    console.log("AllRequest Component");
    return this.UserDataService.getAllRequest(JSON.parse(localStorage.getItem('role_id')), JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('admin_access_id'))).subscribe((response: any) => {
      console.log(response);
      this.dataSource.data = response
    });

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy() {
  }
  status(reqId) {
    this.route.navigate(['/main/status', reqId]);
  }
  view(req_id, pnc) {
    this.route.navigate(['/main/request-form', req_id, pnc]);
  }
}
