import { Label } from 'ng2-charts';
import { Component ,OnInit, OnDestroy, ViewChild, ChangeDetectorRef} from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatTableDataSource, MatPaginator,MatSort, throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { RequestService} from'../Services/RequestService';
import { ReqSchema } from '../Services/ReqSchema';
@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css'],
  providers:[RequestService]
})
export class PendingComponent implements OnInit, OnDestroy{
  displayedColumns: string[] = ['req_id', 'Requesttitle', 'Request Type', 'Requester Id' ,
  'Request City', 'requestinitdate'  , 'status',  'view' , 'Approve'];
 // public dataSource = new MatTableDataSource(this.UserDataService.desiredRequests);
 dataSource = new MatTableDataSource();
 members;
  public userId;
  public pendingRequests: ReqSchema[] = [];
  public roleId;
  public h_id;
  updatedData = [];
 // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  // tslint:disable-next-line: no-shadowed-variable

  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: true}) sort: MatSort;
  constructor( public UserDataService: UserDataService, public requestService: RequestService , private changeDetectorRefs: ChangeDetectorRef) {}
  ngOnInit() {
    console.log("pending Component");

      // this.dataSource.paginator = this.paginator;
      // console.log(this.dataSource);
      this.userId = JSON.parse(localStorage.getItem('userId'));
      console.log(this.userId);
      return this.requestService.getPendingRequest(this.userId).subscribe((response:any)=>{

        this.dataSource.data=response.req_data;
        // for(const i of response){
        //   this.pendingRequests.push({});
        // }
        // localStorage.setItem('pendingReqT', JSON.stringify(this.pendingRequests));
        // console.log(this.pendingRequests);
        // this.roleId=response.role_id;
        // this.h_id=response.h_id;
        // console.log(this.roleId+' '+this.h_id);
       // this.Pending=response.req_stats.Pending,
        //this.Pending=response.req_data,
      });
      this.pendingRequests=JSON.parse(localStorage.getItem('pendingReqT'));
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
