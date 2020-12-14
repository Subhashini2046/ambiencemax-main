import { map } from 'rxjs/operators';
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
    role_id = null;
    w_id=null
    public email = '';
    public password = '';
  Pending:number;
  Closed:number;
  Open:number;
    public reqStats: ReqStats;
    public hId: number;
    public fetchedReqs: ReqSchema[];
    public pendingRequests: ReqSchema[] = [];
    public closedRequests: ReqSchema[] = [];
    public openRequests: ReqSchema[] = [];
    public desiredRequests: ReqSchema[] = [];
    public Workflow = [];

    authenticateUser(email: string, password: string) {
      this.email = email;
      this.password  = password;
      this.http.post<{ result: string,w_id:number, user_id: string,role_id: number,h_id: number }>
        ('http://localhost:3000/login', { email, password })
        .subscribe((ResData) => {
          console.log(ResData);
          this.userId = ResData.user_id;
          this.role_id=ResData.role_id;
          this.w_id=ResData.w_id;
          console.log('================================================');
          console.log('Request Data Fetched On Auth !');
          console.log(this.userId);
          console.log(this.w_id);
          console.log("Request Service");
          console.log('================================================');
          this.router.navigateByUrl('/dashboard');
          if (this.role_id !== null) {
            console.log(this.userId);
            localStorage.setItem('userRole', JSON.stringify(this.role_id));
            localStorage.setItem('userId', JSON.stringify(this.userId));
            localStorage.setItem('w_id', JSON.stringify(this.userId));
          }
        });
    }
  getRequest(user_id:string) {
       return this.http.post<{ result: string,role_id: number, req_stats: ReqStats}>
        ('http://localhost:3000/dashboard', { user_id });
    }
    getRequest1(w_id:number,role_id:number) {
      return this.http.post<{ result: string,role_id: number, req_stats: ReqStats}>
       ('http://localhost:3000/dashboard1', { w_id,role_id });
   }
  
  getBar(user_id:string){
   return this.http.post('http://localhost:3000/dashboard', { user_id }).pipe(map(ResData=>ResData));       
  }
  getPendingRequest(user_id:string){
     return this.http.post<{ result: string, req_data: Observable<ReqSchema[]> , role_id: number , h_id: number}>
      ('http://localhost:3000/pendingReq', { user_id});
  } 
  getClosedRequest(user_id:string){
    return this.http.post<{ result: string, req_data: Observable<ReqSchema[]> , role_id: number , h_id: number}>
     ('http://localhost:3000/closedReq', { user_id});
 }
 getAllRequest(user_id:string){
  return this.http.post<{ result: string, req_data: Observable<ReqSchema[]> , role_id: number , h_id: number}>
   ('http://localhost:3000/allReq', { user_id});
}
 getOpenRequest(user_id:String){
  return this.http.post<{ result: string, req_data: ReqSchema[] , role_id: number , h_id: number}>
  ('http://localhost:3000/openReq', { user_id});
}
  }
