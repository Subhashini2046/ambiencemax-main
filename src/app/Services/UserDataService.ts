import { map } from 'rxjs/operators';
  import { Injectable, OnInit } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { ReqSchema } from './ReqSchema';
  import { Subject } from 'rxjs';
  import { Router } from '@angular/router';
  import { HttpHeaders } from '@angular/common/http';
  import { ClassField } from '@angular/compiler';
  export interface  UserData {
    userId: string;
    email: string;
    password: string;
    userRole: number;
    Requests: ReqSchema[];
    reqStats: ReqStats;
    pendingReq: ReqSchema[];
    closedReq: ReqSchema[];
    openReq: ReqSchema[];
    hId: number;
    reqOffset: number;
    viewReq: ReqSchema;
  } 
  export interface ReqStats {
    All: number;
    Pending: number;
    Closed: number;
    Open: number;
  }
  export interface Role{
    role_id:number;
    role:String;
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
    Data: UserData;
    userId = null;
    userRole = null;
    w_id=null;
    ReqId=null;
    resendTo=" ";
    resendid:number;
    role_id:number;
    ApproveAction="Approved";
    isPending = false;
    public fetchedReqs: ReqSchema[];
    public fetchedReqsUpdated = new Subject<ReqSchema[]>();
    public reqStatsSubject = new Subject<ReqStats>();
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
    fetchDesiredObservable() {
      return this.desiredReqSub.asObservable();
    }
    fetchObservable() {
      return this.fetchedReqsUpdated.asObservable();
    }
    fetchReqStat() {
      return this.reqStatsSubject.asObservable();
    }

    //................................................................//
    authenticateUser1(email: string, password: string) {
      this.email = email;
      this.password  = password;
      this.http.post<{ result: string,w_id:number, user_id: string,role_id: number,h_id: number }>
        ('http://localhost:3000/login', { email, password })
        .subscribe((ResData) => {
          console.log(ResData);
          this.userId = ResData.user_id;
          this.userRole=ResData.role_id;
          this.w_id=ResData.w_id;
          this.router.navigateByUrl('/dashboard');
          if (this.userRole !== null) {
            console.log(this.userId);
            localStorage.setItem('userRole', JSON.stringify(this.userRole));
            localStorage.setItem('userId', JSON.stringify(this.userId));
            localStorage.setItem('w_id', JSON.stringify(this.userId));
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
        console.log("Workflow",this.Workflow);
        console.log("Role",this.role1);
      });
    }
    getViewRequestData(reqId:number){
      return this.http.post('http://localhost:3000/viewRequestData', { reqId });
    }
//...............................................................................//
  getWorkFlow(reqId: number) {
      this.http.post('http://localhost:3000/workflow', {req_id: reqId})
      .subscribe((ResData) => {
        console.log(ResData);
        this.Workflow = ResData[0].w_flow.split(',');
        console.log("Workflow",this.Workflow);
       this.decideApprove();
        });

      }

    getRole(){
      this.http.get<{role_name:RoleMap1}>('http://localhost:3000/getRole')
      .subscribe((ResData) => {
        this.RoleMap1=ResData.role_name;
        console.log("RoleMap1",this.RoleMap1);
        });
    }

    

    getLastApprove(reqId:number)
    {
      //this.RoleMap1[this.viewReq.req_level-2]['role_name'];
      //console.log("Last Approved",this.RoleMap1[this.viewReq.req_level]['role_name']);
      return this.RoleMap1[this.viewReq.req_level]['role_name'];
    }
    getFlow(reqId:number){
      if(this.viewReq.w_id==1){
        for(let i=1;i<this.RoleMap.length;i++)
        {console.log("flow",this.RoleMap[i]);
          this.Workflow.push(this.RoleMap[i])  
      }
      
      }
      if(this.viewReq.w_id==2){
        for(let i=2;i<this.RoleMap.length;i++)
        {console.log("flow",this.RoleMap[i]);
          this.Workflow.push(this.RoleMap[i])  
      }
    }
    if(this.viewReq.w_id==3){
      for(let i=3;i<this.RoleMap.length;i++)
      {console.log("flow",this.RoleMap[i]);
        this.Workflow.push(this.RoleMap[i])  
    }}
    if(this.viewReq.w_id==4){
      for(let i=4;i<this.RoleMap.length;i++)
      {console.log("flow",this.RoleMap[i]);
        this.Workflow.push(this.RoleMap[i])  
    }}
    return this.Workflow;
    }
    ResendUpdate(reqId){
      this.action_taken_by=this.RoleMap[this.userRole-1];
      this.http.post('http://localhost:5600/addResendReqLog', {req_id: reqId , userRole: this.userRole,action_taken_by:this.action_taken_by})
      .subscribe((ResData) => {
        console.log("In Approved Method",ResData);
      });
      if(this.resendTo=="Initiator"){this.userRole=1;}
      if(this.resendTo=="Location Head"){this.userRole=2;}
      if(this.resendTo=="Cluster Head"){this.userRole=3;}
      if(this.resendTo=="City Head"){this.userRole=4;}
      if(this.resendTo=="State Head"){this.userRole=5;}
      if(this.resendTo=="Country Head"){this.userRole=6;}
      if(this.resendTo=="Geography Head"){this.userRole=7;}
      console.log("in resendUpdate",this.resendTo,"",this.userRole);
      // if(this.userRole>1 && this.userRole<8)
      // {
      //   this.userRole=this.userRole-1;
      // }
      // else this.userRole=1;
      this.http.post('http://localhost:5600/resendReq', {req_id: reqId , userRole: this.userRole-1})
      .subscribe((ResData) => {
        console.log("In Resend Method",ResData);
        
      });
    
    }
    decideApprove() {
      console.log(this.userRole.toString());
      if ((this.Workflow.indexOf( this.userRole.toString() ) === 0 && this.viewReq.req_level === 1 )
      || this.Workflow[this.Workflow.indexOf( this.userRole.toString() ) - 1] - this.userRole === this.viewReq.req_level - this.userRole) {
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
    
      this.http.post('http://localhost:3000/approve', {req_id: reqId , userRole: this.userRole})
      .subscribe((ResData) => {
        console.log("In Approved Method",ResData);
      });
      if ( this.Workflow.indexOf(this.userRole.toString()) === this.Workflow.length - 1 ) {
        this.http.post('http://localhost:3000/closeReq', {req_id: reqId })
      .subscribe((ResData) => {
        console.log(ResData);
      });
      }
      this.openRequests.forEach((e , index) => {
        if (e.req_id === this.viewReq.req_id) {
          if ( this.Workflow.indexOf(this.userRole.toString()) === this.Workflow.length - 1 ) {
            e.req_level = this.userRole;
            this.closedRequests.push(e);
            this.reqStats.Closed += 1;
          }
          this.reqStats.Open -= 1;
          this.Data.reqStats.Open = this.reqStats.Open;
          localStorage.setItem('userData', JSON.stringify(this.Data));
          this.openRequests.splice(index, 1);
          console.log(this.pendingRequests);
        }
      });
      this.allRequests.forEach((e) => {
        if (e.req_id === this.viewReq.req_id) {
          e.req_level = this.userRole;
        }
      });
      this.pendingRequests.forEach((e) => {
        if (e.req_id === this.viewReq.req_id) {
          e.req_level = this.userRole;
        }
      });
      console.log(this.allRequests);
      console.log('User Data Service Main : ' + this.main);
      if (this.main === 'Pending') {
        this.desiredRequests = this.pendingRequests;
        console.log('Pending Called');
      // this.isPending = true;
      } else if (this.main === 'all') {
      // this.isPending = false;
        this.desiredRequests = this.allRequests;
        console.log('All Called');
      } else if (this.main === 'closed') {
      // this.isPending = false;
        this.desiredRequests = this.closedRequests;
        console.log('Closed Called');
      } else if (this.main === 'open') {
        // this.isPending = false;
        this.desiredRequests = this.openRequests;
        console.log('Open Called');
      }
      this.desiredReqSub.next(this.desiredRequests);
      this.toBeApproved = false;
      console.log("in approvelog",reqId,"and userRole is",this.userRole);
      this.action_taken_by=this.RoleMap[this.userRole-1];
      this.http.post('http://localhost:5600/addLog', {req_id: reqId , userRole: this.userRole,action_taken_by:this.action_taken_by})
      .subscribe((ResData) => {
        console.log("In Approved Method",ResData);
      });
    }
    addRequest(newReq: ReqSchema) {
      this.http.post('http://localhost:3000/newReq', {request: newReq}).subscribe((data:ReqSchema) => {
        console.log('Request Submitted!');
        //this.newReqId=Number(ResData);]
       // this.newReqId=data.req_id;
      console.log(data);
       this.addToLog(JSON.parse(JSON.stringify(data)).id);
      
      });
      
    }
      //console.log(this.newReqId,"New Request Id");
      //this.newReqId=Number(this.http.get('http://localhost:5600/selectNewReqId').subscribe((ResData)=>{this.newReqId=Number(ResData);console.log(this.newReqId);}));
      addToLog(newReqId){
      console.log(newReqId,"New Request Id b4 Select Query");
      this.http.post('http://localhost:5600/addLogNewReq', {req_id:newReqId , userRole: this.userRole})
      .subscribe((ResData) => {
        console.log("In AddLog Method",ResData);
      });
    //this.addReqToLog()
    }
    
    compare(a: ReqSchema, b: ReqSchema ) {
      if ( a.req_id < b.req_id ) {
        return 1;
      }
      if ( a.req_id > b.req_id ) {
        return -1;
      }
      return 0;
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
