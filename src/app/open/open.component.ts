import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ReqSchema } from '../Services/ReqSchema';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-open',
  templateUrl: './open.component.html',
  styleUrls: ['./open.component.css'],
})
export class OpenComponent implements OnInit{
  displayedColumns: string[] = ['RUMPRequestNumber', 'RUMPRequestSubject', 'RUMPRequestType','RUMPRequestStatus', 
  'RUMPRequestDate'];

  dataSource = new MatTableDataSource();
  members;
  public openRequests: ReqSchema[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private http: HttpClient, public userService: UserDataService, private changeDetectorRefs: ChangeDetectorRef, private route: Router) { }
  ngOnInit() {
    console.log("Open Component");

    //get all Open Request
    return this.userService.getOpenRequest(JSON.parse(localStorage.getItem('role_id')), JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('userId'))).subscribe((response: any) => {
      this.dataSource.data = response
    });

  }

  // navigate to view reuqest data,approve or resend or reuqest update or BOQ form or PNC form
  view(req_id, pnc,space,roleId) {
   //this.route.navigate(['/AmbienceMax/request-form', req_id, pnc]);
   //this.route.navigateByUrl('/AmbienceMax/requestDetail');
   this.route.navigate(['/AmbienceMax/requestDetail', req_id, pnc,space,roleId]);
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
