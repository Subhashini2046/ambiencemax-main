import { Component, OnInit, ViewChild} from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-draft-request',
  templateUrl: './draft-request.component.html',
  styleUrls: ['./draft-request.component.css']
})
export class DraftRequestComponent implements OnInit {
  displayedColumns: string[] = ['RequestType','RequestSubject','RequestDescription',
  'RequestDate','view'];
dataSource = new MatTableDataSource();
members;
role_id;
accessId;
readstatus:any[]=[]
hover=false;
@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
@ViewChild(MatSort, { static: true }) sort: MatSort;
constructor(private route: Router, public userService: UserDataService) { }
ngOnInit() {
  

  //this.accessId = JSON.parse(localStorage.getItem('admin_access_id'));
  this.role_id = JSON.parse(localStorage.getItem('role_id'));
  this.fetchAllDraftRequest();
}
fetchAllDraftRequest(){
  this.userService.fetchAllDraftRequest(JSON.parse(localStorage.getItem('userId')),localStorage.getItem('space'),this.role_id).subscribe((response: any) => {
    this.dataSource.data= response;
  });
}
deleteDraftRequest(draftReqId) {
  this.hover=true;
  this.userService.deleteDraftReques(draftReqId).subscribe((response:any)=>{

    this.fetchAllDraftRequest();
  })}
// navigate to view reuqest data
viewDraftRequest(req_id) {
  if (this.hover){
    this.hover=false;
    return;
  }
  if(!this.hover){
  this.route.navigate(['/AmbienceMax/raiseRequest', req_id]);
}
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
