import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef} from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-all-request',
  templateUrl: './all-request.component.html',
  styleUrls: ['./all-request.component.css']
})
export class AllRequestComponent implements OnInit {
  displayedColumns: string[] = ['req_id', 'Requesttitle', 'Request Type', 'Requester Id' ,
  'Request City', 'requestinitdate'  , 'status',  'view' , 'Approve'];
  public dataSource = new MatTableDataSource(this.UserDataService.desiredRequests);
  updatedData = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  // tslint:disable-next-line: no-shadowed-variable
  constructor( public UserDataService: UserDataService , private changeDetectorRefs: ChangeDetectorRef) {}
  ngOnInit() {
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource);
  }
  ngOnDestroy() {
  }
  reRender() {
    // this.dataSource = new MatTableDataSource(this.UserDataService.desiredRequests);
    this.UserDataService.fetchMoreRequests();
    this.UserDataService.fetchDesiredObservable().subscribe((e)=>{
      this.dataSource.data = e;
    });
    // this.paginator._changePageSize(10);
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
