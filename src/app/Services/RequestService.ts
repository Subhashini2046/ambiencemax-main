import { Injectable, OnInit } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { ReqSchema } from './ReqSchema';
  import { Subject, Observable } from 'rxjs';
  import { Router } from '@angular/router';
  import { HttpHeaders } from '@angular/common/http';

  export interface ReqStats {
    All: number;
    Pending: number;
    Closed: number;
    Open: number;
  }
  @Injectable()
  export class RequestService{
    constructor( private http: HttpClient, private router: Router) {}
    userId = null;
    userRole = null;
    public reqStats: ReqStats;
    public hId: number;
    public fetchedReqs: ReqSchema[];
    public pendingRequests: ReqSchema[] = [];
    public closedRequests: ReqSchema[] = [];
    public openRequests: ReqSchema[] = [];
    public desiredRequests: ReqSchema[] = [];
    public Workflow = [];
    getRequest(user_id:string) {
      // return this.reqStatsSubject.asObservable();
       return this.http.post<{ result: string, role_id: number , req_stats: ReqStats , h_id: number}>
        ('http://localhost:3000/dashboard', { user_id });
        // .subscribe((ResData) => {
        //     console.log(ResData);
        //     this.userRole = ResData.role_id;
        //     this.hId = ResData.h_id;
        //     this.reqStats=ResData.req_stats;
        //     console.log(this.hId);
        //     console.log('================================================');
        //     console.log('Request State Fetched !');
        //     console.log(this.reqStats);
        //     console.log('================================================');
        //    // this.router.navigateByUrl('/dashboard');
        //     if (this.userRole !== null) {
        //         localStorage.setItem('userRequest', JSON.stringify(this.reqStats));
        //         console.log(this.reqStats);
        //       }
        // });
    }
  
  getPendingRequest(user_id:string){
     return this.http.post<{ result: string, req_data: Observable<ReqSchema[]> , role_id: number , h_id: number}>
      ('http://localhost:3000/pendingReq', { user_id});
  } 
  getClosedRequest(user_id:string){
    return this.http.post<{ result: string, req_data: Observable<ReqSchema[]> , role_id: number , h_id: number}>
     ('http://localhost:3000/closedReq', { user_id});
 }
 getOpenRequest(user_id:String){
  this.http.post<{ result: string, req_data: ReqSchema[] , role_id: number , h_id: number}>
  ('http://localhost:3000/openReq', { user_id})
  .subscribe((ResData) => {;
  this.fetchedReqs = ResData.req_data;
  this.userRole=ResData.role_id;
  //console.log(this.fetchedReqs);
  console.log("//+++++++++++++++++//");
  this.ReqClassification(this.fetchedReqs);
 localStorage.setItem('openRequest', JSON.stringify(this.openRequests));
 console.log(this.openRequests);
 });
}

 ReqClassification(Requests: ReqSchema[]) {
  Requests.forEach(( el ) => {
        
    if (el.req_status === 'Pending') {
          this.http.post('http://localhost:3000/workflow', {req_id: el.req_id})
          .subscribe((ResData) => {
            console.log(ResData);
            this.Workflow = ResData[0].w_flow.split(',');
            this.Workflow.unshift(el.req_initiator_id);
            
            
          //console.log("Workflow in reqclassification",this.Workflow,"request level",el.req_level,"userRole",this.userRole);
          for(let i=0;i<this.Workflow.length;i++){  
            console.log(this.Workflow[i],"Workflow with initiator_id");
            console.log(this.userRole,"userRole");  
            if (this.Workflow[i]==this.userRole) {
              console.log("Workflow in reqclassification",this.Workflow[i],"i-1",this.Workflow[i]-1,"request level",el.req_level,"userRole",this.userRole);
              console.log("in reqClassification",el.req_level," ",this.userRole);
              if(el.req_level == this.userRole-1) 
              {
                this.openRequests.push(el);
              console.log('Open Classification Done! for Request Id ' + el.req_id);}
              } 
              
      }

    }
    );}
      }); 
    }
  }
  