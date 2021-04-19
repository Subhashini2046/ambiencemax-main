import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
@Component({
  selector: 'app-close',
  templateUrl: './close.component.html',
  styleUrls: ['./close.component.css'],
})
export class CloseComponent implements OnInit{
  displayedColumns: string[] = ['reqNumber', 'Request Subject', 'Request Type',
    'RequestDate', 'status', 'view','progress'];

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

 // navigate to view reuqest data
  view(req_id) {
    this.route.navigate(['/AmbienceMax/view', req_id]);
  }

  // to check reuqest log and request status
  status(reqId) {
    this.route.navigate(['/AmbienceMax/status', reqId]);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  // to serach a location etc.
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
