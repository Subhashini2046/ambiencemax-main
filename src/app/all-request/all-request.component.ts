import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
@Component({
  selector: 'app-all-request',
  templateUrl: './all-request.component.html',
  styleUrls: ['./all-request.component.css'],
})
export class AllRequestComponent implements OnInit {
  displayedColumns: string[] = ['RUMPRequestNumber', 'RUMPRequestSubject', 'RUMPRequestType','RUMPRequestStatus', 
  'RUMPRequestDate'];
  dataSource = new MatTableDataSource();

  reqStatus
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private route: Router, public userService: UserDataService, private changeDetectorRefs: ChangeDetectorRef) { }
  ngOnInit() {
    console.log("AllRequest Component");

    // fetech all request
    return this.userService.getAllRequest(JSON.parse(localStorage.getItem('role_id')), JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('admin_access_id'))).subscribe((response: any) => {
      this.dataSource.data = response
    });

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // to check reuqest log and request status
  status(reqId) {
    this.route.navigate(['/AmbienceMax/status', reqId]);
  }

  // navigate to view reuqest data
  view(req_id, pnc, reqStatus) {
    if (reqStatus.toString().trim() === 'Pending') {
      this.route.navigate(['AmbienceMax/viewRequest', req_id]);
    }
    else if (reqStatus.toString().trim() === 'Completed') {
      this.route.navigate(['AmbienceMax/viewRequest', req_id]);
    }
    else if (reqStatus.toString().trim() === 'Closed') {
      this.route.navigate(['AmbienceMax/viewRequest', req_id]);
    }
    else
      this.route.navigate(['/AmbienceMax/requestDetail', req_id, pnc]);
  }

  // to serach a location etc.
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
