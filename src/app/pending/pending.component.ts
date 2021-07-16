import { Component, OnInit, ViewChild} from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css']
})
export class PendingComponent implements OnInit {
  displayedColumns: string[] = ['RUMPRequestNumber', 'RUMPRequestSubject', 'RUMPRequestType','RUMPRequestStatus', 
  'RUMPRequestDate'];
  dataSource = new MatTableDataSource();
  members;
  role_id;
  accessId;
  readstatus:any[]=[]
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private route: Router, public userService: UserDataService) { }
  ngOnInit() {
    console.log("pending Component");

  //  this.accessId = JSON.parse(localStorage.getItem('admin_access_id'));
    this.role_id = JSON.parse(localStorage.getItem('role_id'));
    
    //get all Pending Request
    this.userService.getPendingRequest(this.role_id, JSON.parse(localStorage.getItem('space')), JSON.parse(localStorage.getItem('userId'))).subscribe((response: any) => {
      this.dataSource.data= response;
    });

  }

  // navigate to view reuqest data
  view(req_id) {
    // this.route.navigate(['/AmbienceMax/view', req_id]);
    this.route.navigate(['/AmbienceMax/viewRequest', req_id]);
  }

  // to check reuqest log and request status
  status(reqId) {
    this.route.navigate(['/AmbienceMax/status', reqId]);
  }

  // to serach a location etc.
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
