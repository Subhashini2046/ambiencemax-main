import { Component, OnInit,ViewChild } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { DatePipe } from '@angular/common';
import {Location} from '@angular/common';
import { RequestService } from '../Services/RequestService';
import { MatTableDataSource, MatPaginator, MatSort, throwMatDialogContentAlreadyAttachedError } from '@angular/material';
@Component({
  selector: 'app-view-status',
  templateUrl: './view-status.component.html',
  styleUrls: ['./view-status.component.css'],
  providers: [RequestService]
})
export class ViewStatusComponent implements OnInit {
  displayedColumns: string[] = ['aaction_taken_by', 'req_action', 'req_date', 'req_time'];
  dataSource = new MatTableDataSource();
  members;
 
  //len = this.UsrDataService.viewReq.ReqApprovers.length;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  constructor(public UsrDataService: UserDataService,public requestService: RequestService,private _location: Location) {
    //console.log(this.UsrDataService.viewReq.ReqApprovers);
   }

   backClicked() {
    this._location.back();
    console.log( 'goBack()...' );
    // let main='Pending';
    //  this.router.navigate([`/dashboard/${main}`]);
    //   console.log("dashboard");
    
  }
  ngOnInit() { 
    console.log(this.UsrDataService.viewReq.req_id);
    return this.UsrDataService.getViewRequestLog(this.UsrDataService.viewReq.req_id).subscribe((response: any) => {
      console.log(response.req_data['req_date']);
     // var datePipe = new DatePipe('en-US');
      //response.req_data.req_date=datePipe.transform(response.req_data.req_date, 'dd/MM/yyyy');
     // console.log(response.req_data.req_date);
      this.dataSource.data = response.req_data;

    });
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }


}
