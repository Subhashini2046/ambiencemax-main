import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef} from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatTableDataSource, MatPaginator,MatSort } from '@angular/material';
import { RequestService} from'../Services/RequestService';
@Component({
  selector: 'app-close',
  templateUrl: './close.component.html',
  styleUrls: ['./close.component.css'],
  providers:[RequestService]
})
export class CloseComponent implements OnInit,OnDestroy {
  displayedColumns: string[] = ['req_id', 'Requesttitle', 'Request Type', 'Requester Id' ,
  'Request City', 'requestinitdate'  , 'status',  'view' , 'Approve'];
 // public dataSource = new MatTableDataSource(this.UserDataService.desiredRequests);
 dataSource = new MatTableDataSource();
 members;
 public userId;
  updatedData = [];
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: true}) sort: MatSort;
 // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  // tslint:disable-next-line: no-shadowed-variable
  constructor( public UserDataService: UserDataService ,public requestService: RequestService, private changeDetectorRefs: ChangeDetectorRef) {}
  ngOnInit() {
      console.log("Closed Component");
      this.userId = JSON.parse(localStorage.getItem('userId'));
      console.log(this.userId);
      return this.UserDataService.getClosedRequest(this.userId).subscribe((response:any)=>{

        this.dataSource.data=response.req_data;
      });
      // this.dataSource.paginator = this.paginator;
      // console.log(this.dataSource);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy() {
  }
  approve(no: number , id: string) {}
  findStatus(reqNo: number) {
    let status: string;
    // if (this.UserDataService.currUser.designation === 'Requester'
    // || this.UserDataService.currUser.designation === 'admin') {
    //   this.RequestDataService.allRequests.forEach(req => {
    //     if (req.RequestNo === reqNo) {
    //       status = req.status;
    //     }
    //   });
    //   return status;
    // }
    // this.RequestDataService.allRequests.forEach(req => {
    //   if (req.RequestNo === reqNo) {
    //     req.ReqApprovers.forEach(app => {
    //       if (app.name === this.UserDataService.currUser.firstname) {
    //         status = app.status;
    //       }
    //     });
    //   }
    // });
    return status;
  }
}
