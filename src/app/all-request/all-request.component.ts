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
  displayedColumns: string[] = ['reqNumber', 'Request Subject', 'Request Type',
    'RequestDate', 'status', 'view', 'Approve'];
  dataSource = new MatTableDataSource();

  reqStatus
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
    this.route.navigate(['/AmbienceMax/status', reqId]);
  }
  view(req_id, pnc,reqStatus) {
    console.log(reqStatus,reqStatus.toString().trim() === 'Pending');
    if(reqStatus.toString().trim() === 'Pending'){
      this.route.navigate(['AmbienceMax/view', req_id]);
    }
   else if(reqStatus.toString().trim() === 'Completed'){
      this.route.navigate(['AmbienceMax/view', req_id]);
    }
    else if(reqStatus.toString().trim() === 'Closed'){
      this.route.navigate(['AmbienceMax/view', req_id]);
    }
    else
        this.route.navigate(['/AmbienceMax/request-form', req_id, pnc]);
  }
}
