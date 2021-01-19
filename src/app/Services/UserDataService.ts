import { map } from 'rxjs/operators';
  import { Injectable, OnInit } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { ReqSchema } from './ReqSchema';
  import { Subject } from 'rxjs';
  import { Router } from '@angular/router';
  import { HttpHeaders } from '@angular/common/http';
  import { ClassField } from '@angular/compiler';
  export interface ReqStats {
    All: number;
    Pending: number;
    Closed: number;
    Open: number;
  }
  export interface Role{
    role_id:number;
    role_name:String;
  }
  export interface RoleMap1{
    role:String;
  }
  @Injectable()
  export class UserDataService {
    usersURL="http://localhost:5600/api/users";
    httpOptions = {

      headers: new HttpHeaders({

        'Content-Type': 'application/json',

      })

    }
    constructor( private http: HttpClient, private router: Router) {}
    index:number;
    userId = null;
    user_Permission=null;
    userRole = null;
    userRole1=0;
    w_id=null;
    ReqId=null;
    resendTo=" ";
    resendid:number;
    role_id:number;
    ApproveAction="Approved";
    isPending = false;
    public filepath=[];
    public desiredReqSub = new Subject<ReqSchema[]>();
    public mainSub = new Subject<string>();
    public toBeApproved = false;
    public message = '';
    public email = '';
    public password = '';
    public reqStats: ReqStats;
    public hId: number;
    public reqOffset: number;
    public reqStart: number;
    public main = '';
    public viewReq: ReqSchema;
    public viewReq1: ReqSchema;
    public allRequests: ReqSchema[] = [];
    public pendingRequests: ReqSchema[] = [];
    public closedRequests: ReqSchema[] = [];
    public openRequests: ReqSchema[] = [];
    public underNegRequests: ReqSchema[] = [];
    public desiredRequests: ReqSchema[] = [];
    public Workflow = [];
    public role1:Role[] = [];

    action_taken_by="";
    newReqId:number;
    public reqTypeData: {
      'Pending': number,
      'Closed': number,
      'Open': number
    };
    public RoleMap = [
      'Building Head',
      'Location Head',
      'Cluster Head',
      'City Head',
      'State Head',
      'Country Head',
      'Geography Head'
    ];
    public RoleMap1:RoleMap1;
    mainObservable(){
      return this.mainSub.asObservable();
    }
    //................................................................//
    authenticateUser1(email: string, password: string) {
      this.email = email;
      this.password  = password;
      this.http.post<{ result: string,w_id:number,user_permission:number, user_id: string,role_id: number,h_id: number }>
        ('http://localhost:3000/login', { email, password })
        .subscribe((ResData) => {
          console.log(ResData);
          this.userId = ResData.user_id;
          this.userRole=ResData.role_id;
          this.w_id=ResData.w_id;
          this.user_Permission=ResData.user_permission;
          console.log("user_Permission",this.user_Permission);
          this.router.navigateByUrl('/dashboard');
          if (this.userRole !== null) {
            console.log(this.userId);
            localStorage.setItem('userRole', JSON.stringify(this.userRole));
            localStorage.setItem('userId', JSON.stringify(this.userId));
            localStorage.setItem('w_id', JSON.stringify(this.userId));
            localStorage.setItem('user_Permission', JSON.stringify(this.user_Permission));
          }
        });
    }

    getRequest(user_id: string) {
      return this.http.post('http://localhost:3000/dashboard', { user_id });
    }
   getBar(user_id: string) {
      return this.http.post('http://localhost:3000/dashboard', { user_id }).pipe(map(ResData => ResData));
    }
    getPendingRequest(user_id: string) {
      return this.http.post('http://localhost:3000/pendingReq', { user_id });
    }
    getClosedRequest(user_id: string) {
      return this.http.post('http://localhost:3000/closedReq', { user_id });
    }
    getAllRequest(user_id: string) {
      return this.http.post('http://localhost:3000/allReq', { user_id });
    }
    getOpenRequest(user_id: String) {
      return this.http.post('http://localhost:3000/openReq', { user_id });
    }
  
    getViewStatus(reqId:number){
      this.http.post<{ result: string,w_flow:[], role: Role[]}>('http://localhost:3000/viewStatus', {req_id: reqId})
      .subscribe((ResData) => {
        console.log(ResData);
        this.Workflow=ResData.w_flow;
        this.role1=ResData.role;
        this.role1.sort((a,b) => a.role_id-b.role_id);
 });
    }
    getData(){
      
    }
    getViewRequestLog(reqId:number){
      return this.http.post('http://localhost:3000/viewRequestLog', { reqId });
    }
    getViewRequestData(reqId:number){
      return this.http.post('http://localhost:3000/viewRequestData', { reqId });
    }
    addRequest(newReq: ReqSchema,filepath) {
      this.http.post('http://localhost:3000/newReq', {request: newReq}).subscribe((data:ReqSchema) => {
      this.addToLog(JSON.parse(JSON.stringify(data)).id,filepath);
      });
    }
    addUpdateRequest(RequestData,reqId:number) {
      console.log("updateRequestData..",RequestData,reqId);
      this.http.post('http://localhost:3000/updateRequest', {RequestData,reqId}).subscribe((resData) => {
    console.log(resData);  
    });
    }
    addToLog(newReqId, filepath) {
      for (let i = 0; i < filepath.length; i++) {
        filepath[i] = filepath[i];
        this.http.post('http://localhost:3000/fileUpload', { req_id: newReqId, filepath: filepath[i] })
          .subscribe((ResData) => {
          });
      }
      this.http.post('http://localhost:5600/addLogNewReq', { req_id: newReqId, userRole: this.userRole })
        .subscribe((ResData) => {
        });
    }
    getviewUpdateRequest(reqId:number){
      return this.http.post('http://localhost:3000/viewUpdateRequest', { reqId });
    }
//...............................................................................//
  

    getRole(){
      this.http.get<{role_name:RoleMap1}>('http://localhost:3000/getRole')
      .subscribe((ResData) => {
        this.RoleMap1=ResData.role_name;
        console.log("RoleMap1",this.RoleMap1);
        });
    }
    
    ResendUpdate(reqId){
      this.action_taken_by=this.RoleMap[this.userRole-1];
      this.http.post('http://localhost:5600/addResendReqLog', {req_id: reqId , userRole: this.userRole,action_taken_by:this.action_taken_by})
      .subscribe((ResData) => {
        console.log("In Approved Method",ResData);
      });
      console.log("this.viewReq.req_initiator_id",this.viewReq.req_initiator_id)
      if(this.resendTo=="Initiator" && this.viewReq.req_initiator_id==1){this.userRole=1;}
      if(this.resendTo=="Initiator" && this.viewReq.req_initiator_id==8){
        this.userRole=this.viewReq.req_initiator_id ;}
      if(this.resendTo=="Location Head"){this.userRole=2;}
      if(this.resendTo=="Cluster Head"){this.userRole=3;}
      if(this.resendTo=="City Head"){this.userRole=4;}
      if(this.resendTo=="State Head"){this.userRole=5;}
      if(this.resendTo=="Country Head"){this.userRole=6;}
      if(this.resendTo=="Geography Head"){this.userRole=7;}
      console.log("in resendUpdate",this.resendTo,"",this.userRole); 
      this.http.post('http://localhost:5600/resendReq', {req_id: reqId , userRole: this.userRole})
      .subscribe((ResData) => {
        console.log("In Resend Method",ResData);
     });
    
    }
    getWorkFlow(reqId: number) {
      this.http.post('http://localhost:3000/workflow', {req_id: reqId})
      .subscribe((ResData) => {
        console.log(ResData);
        this.Workflow = ResData[0].w_flow.split(',');
        console.log("Workflow",this.Workflow);
       this.decideApprove();
        });

      }
    decideApprove() {
      console.log("User Role:",this.userRole.toString());
      console.log("w1",this.Workflow.indexOf( this.userRole.toString()));
      console.log("w2",this.viewReq.req_level);
      console.log("user_r",this.userRole>=1);
      this.userRole1=this.Workflow.indexOf( this.userRole.toString());
      this.userRole1=this.Workflow[this.userRole1+1];
      console.log("next user Role",this.userRole1);
      if (this.Workflow.indexOf( this.userRole.toString())==0 || (this.Workflow.indexOf( this.userRole.toString()))) {
        this.toBeApproved = true;
        console.log(this.toBeApproved);
        localStorage.setItem('toBeApproved', JSON.stringify(this.toBeApproved));
        console.log(JSON.parse(localStorage.getItem('toBeApproved')));
        this.message = '';
        this.viewReq.req_level = this.userRole;
      }
      if ( this.viewReq.req_level + 1 === this.userRole || this.userRole === 1 ) {
        this.message = '';
      } else if (this.viewReq.req_level >= this.userRole) {
        this.message = 'You have already acted on this request';
      } else if (this.viewReq.req_level < this.userRole) {
        this.message = 'This request is still in the Open queue of previous aprrovers ';
      }
      localStorage.setItem('toBeApproved', JSON.stringify(this.toBeApproved));
      localStorage.setItem('message', JSON.stringify(this.message));
    }
    Approved(reqId: number) {
      console.log("req id.....",reqId);
      console.log("Next User Role.....:",this.userRole1);
      this.http.post('http://localhost:3000/approve', {req_id: reqId , userRole: this.userRole1})
      .subscribe((ResData) => {
        console.log("In Approved Method",ResData);
      });

      if ( this.Workflow.indexOf(this.userRole.toString()) === this.Workflow.length - 1 ) {
        this.http.post('http://localhost:3000/closeReq', {req_id: reqId })
      .subscribe((ResData) => {
        console.log(ResData);
      });
      }
      this.toBeApproved = false;
      console.log("in approvelog",reqId,"and userRole is",this.userRole);
     this.action_taken_by=this.RoleMap[this.userRole-1];
      console.log("this.action_taken_by",this.action_taken_by);
      console.log("user ....Role",this.userRole,this.ReqId);
      this.http.post('http://localhost:5600/addLog', {req_id: reqId , userRole: this.userRole,action_taken_by:this.action_taken_by})
      .subscribe((ResData) => {
        console.log("In add log",ResData);
      });
    }
    
    getUsers(req_id){
    
      return this.http.get(this.usersURL + `/${req_id}`);
    }
    Addaction(reqId: Number) {
      this.http.post('http://localhost:3000/getRole', {req_id: reqId }).subscribe((ResData)=>{
      // .subscribe((ResData) => {
        console.log(ResData);
        // return this.http.get(reqId);
      
      });
    }
    addAction(reqId: number) {
      this.http.post('http://localhost:3000/getflow', {req_id: reqId})
      .subscribe((ResData) => {
        console.log(ResData);
      });

    }
  }
