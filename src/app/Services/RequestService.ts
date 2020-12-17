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
export interface Role{
  role_id:number;
  role:String;
}
@Injectable()
export class RequestService {
  constructor(private http: HttpClient, private router: Router) { }
  public viewReq: ReqSchema;
  public Workflow = [];
  public role1:Role[] = [];

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
      console.log("ViewReq",this.viewReq);
    });
  }
}
