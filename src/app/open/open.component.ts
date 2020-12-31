import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef} from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatTableDataSource, MatPaginator,MatSort } from '@angular/material';
import { RequestService} from'../Services/RequestService';
import { ReqSchema } from '../Services/ReqSchema';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-open',
  templateUrl: './open.component.html',
  styleUrls: ['./open.component.css'],
  providers:[RequestService]
})
export class OpenComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['req_id', 'Requesttitle', 'Request Type', 'Requester Id' ,
  'Request City', 'requestinitdate'  , 'status',  'view' , 'Approve','Update'];
 // public dataSource = new MatTableDataSource(this.UserDataService.desiredRequests);
 dataSource = new MatTableDataSource();
 members;
 public userId;
 public Workflow=[];
 public openRequests: ReqSchema[] = [];
//  updatedData = [];
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: true}) sort: MatSort;
  //@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  // tslint:disable-next-line: no-shadowed-variable
  constructor( private http: HttpClient,public UserDataService: UserDataService,public requestService: RequestService, private changeDetectorRefs: ChangeDetectorRef) {}
  ngOnInit() {
     console.log("Open Component");
     console.log("permission",this.UserDataService.user_Permission)
     this.userId = JSON.parse(localStorage.getItem('userId'));
     this.UserDataService.userRole=JSON.parse(localStorage.getItem('userRole'));
      console.log(this.userId);
      return this.UserDataService.getOpenRequest(this.userId).subscribe((response:any)=>{

        this.dataSource.data=response.req_data});
     
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
