import { Options } from './../navigation-home/navigation-home.component';
import { map } from 'rxjs/operators';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ReqSchema } from './ReqSchema';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
@Injectable()
export class UserDataService {
  changedetectInRole = new BehaviorSubject(null);
  usersURL = "http://localhost:5600/api/users";
  httpOptions = {

    headers: new HttpHeaders({

      'Content-Type': 'application/json',

    })

  }
  constructor(private http: HttpClient, private router: Router) { }
  meType;
  userId = null;
  space = null;
  userRole = null;
  role_id: number;
  public filepath = [];
  public mainSub = new Subject<string>();
  public main = '';

  mainObservable() {
    return this.mainSub.asObservable();
  }

  //.................User Authentication................//
  authenticateUser1(userId: number, password: string) {
    console.log(userId);
    this.http.post<{ result: string, space: string, user_id: string, role_id: number, admin_access_id: number, user_name: string }>
      ('http://localhost:3000/login', { userId, password })
      .subscribe((ResData) => {
        console.log(ResData)
        if (ResData.role_id !== undefined) {
          console.log(this.userId);
          localStorage.setItem('role_id', JSON.stringify(ResData.role_id));
          localStorage.setItem('userId', JSON.stringify(ResData.user_id));
          localStorage.setItem('space', JSON.stringify(ResData.space));
          localStorage.setItem('admin_access_id', JSON.stringify(ResData.admin_access_id));
          localStorage.setItem('user_name', JSON.stringify(ResData.user_name));
          this.router.navigateByUrl('AmbienceMax/dashboard');
        }
      });
  }

  getRequestCount(role, space) {
    return this.http.post('http://localhost:3000/dashboard', { role, space });
  }
  getBar(user_id: string) {
    return this.http.post('http://localhost:3000/dashboard', { user_id }).pipe(map(ResData => ResData));
  }
  getPendingRequest(role, space, access_id) {
    return this.http.post('http://localhost:3000/pendingReq', { role, space, access_id });
  }
  getClosedRequest(role, space, access_id) {
    return this.http.post('http://localhost:3000/closedReq', { role, space, access_id });
  }
  getAllRequest(role, space, access_id) {
    return this.http.post('http://localhost:3000/allReq', { role, space, access_id });
  }
  getOpenRequest(role, space, access_id) {
    return this.http.post('http://localhost:3000/openReq', { role, space, access_id });
  }
  getCompleteRequest(role, space, access_id) {
    return this.http.post('http://localhost:3000/complete_reqs', { role, space, access_id });
  }
  addCompleteRequest(req_id, accessID, role_name) {
    return this.http.post<any>('http://localhost:3000/addCompeteRequest', { req_id, accessID, role_name });
  }
  //.................get vendor Details................//
  getVendorDetails(vendCategoryId) {
    return this.http.post<any>('http://localhost:3000/vendorDetail', { vendCategoryId });
  }

  //.................approve................//
  getSpocDetails(req_id) {
    return this.http.post<any>('http://localhost:3000/getSpocs', { req_id });
  }
  addVendors(vendorList, req_id, reqComment, accessID, role_name) {
    return this.http.post<any>('http://localhost:3000/addVendors', { vendorList, req_id, reqComment, accessID, role_name });
  }
  //.................(add Request)................//
  getRequestDetail(req_id) {
    return this.http.post<any>('http://localhost:3000/requestDetail', { req_id });
  }
 //.....Add Pnc details once head of maintenance tagged the vendor(addRequest).......//
  addPncByInitiator(allocatedDays, allocationStartDate, actualCost, req_id, VendorPk, filepath) {
    //console.log(filepath1)
    this.http.post<any>('http://localhost:3000/addPnc', { allocatedDays, allocationStartDate, actualCost, req_id, VendorPk }).subscribe((data) => {
      this.addPncfile(req_id, filepath);
    });
  }
  addPncfile(reqId, filepath) {
    for (let i = 0; i < filepath.length; i++) {
      filepath[i] = filepath[i];
      this.http.post('http://localhost:3000/pncfileUpload', { req_id: reqId, filepath: filepath[i] })
        .subscribe((ResData) => {
        });
    }
  }

  //.................(approve Request)................//
  approveRequest(reqComment, req_id, userId, accessID, role_name) {
    let meType = this.meType;
    return this.http.post<any>('http://localhost:3000/approveRequest', { reqComment, req_id, userId, accessID, role_name, meType });
  }
  //.................(add Request)................//
  resendRequest(reqComment, req_id, resendToId, accessID, role_name) {
    return this.http.post<any>('http://localhost:3000/resendRequest', { reqComment, req_id, resendToId, accessID, role_name });
  }

  getViewRequestStatus(req_id) {
    return this.http.post<any>('http://localhost:3000/viewStatuss', { req_id });
  }
  getViewRequestLog(reqId: number) {
    return this.http.post('http://localhost:3000/viewRequestLog', { reqId });
  }
  getViewRequestData(reqId: number) {
    return this.http.post('http://localhost:3000/viewRequestData', { reqId });
  }
  addRequest(newReq: ReqSchema, space, user_name, filepath) {
    this.http.post('http://localhost:3000/newReq', { request: newReq, space }).subscribe((data: ReqSchema) => {
      this.addToLog(JSON.parse(JSON.stringify(data)).id, user_name, filepath);
      this.router.navigateByUrl('/AmbienceMax/dashboard');
    });
  }
  updateRequest(request: ReqSchema,accessID, req_id,role_name){
   return this.http.post('http://localhost:3000/updateRequests', { request:request,accessID, req_id,role_name});
    
  }
  addUpdateRequest(RequestData, reqId: number) {
    this.http.post('http://localhost:3000/updateRequest', { RequestData, reqId }).subscribe((resData) => {
    });
  }
  addToLog(newReqId, user_name, filepath) {
    for (let i = 0; i < filepath.length; i++) {
      filepath[i] = filepath[i];
      this.http.post('http://localhost:3000/fileUpload', { req_id: newReqId, filepath: filepath[i] })
        .subscribe((ResData) => {
        });
    }
    this.http.post('http://localhost:5600/addLogNewReq', { req_id: newReqId, user_name: user_name })
      .subscribe((ResData) => {
      });
  }

  getViewRequestDetail(reqId) {
    return this.http.post('http://localhost:3000/ViewRequestDetail', { reqId });
  }
  //.................get Request Details (updateRequest)................//
  getRequestDetails(reqId) {
    return this.http.post('http://localhost:3000/requestDetails', { reqId });
  }

  //.................addBOQDDetails (addRequests)................//
  addBOQDDetails(reqId, role, boqDescription, boqEstimatedCost, boqEstimatedTime, filepath) {
    this.http.post('http://localhost:3000/BOQRequests', { reqId, role, boqDescription, boqEstimatedCost, boqEstimatedTime }).subscribe((data: ReqSchema) => {
      this.addBOQfile(reqId, filepath);
    });
  }
  addBOQfile(reqId, filepath) {
    for (let i = 0; i < filepath.length; i++) {
      filepath[i] = filepath[i];
      this.http.post('http://localhost:3000/fileUpload', { req_id: reqId, filepath: filepath[i] })
        .subscribe((ResData) => {
        });
    }
  }

  getUsers(id) {
    return this.http.get(`http://localhost:3000/roles?userid=${id}`);
  }

  getUserRoles(req_id) {
    return this.http.get(this.usersURL + `/`)
  }
  getRoles(req_id, accessId) {
    return this.http.post('http://localhost:5600/users', { req_id, accessId });
    //return this.http.get(this.usersURL + `/${req_id},accessId`);
  }
  downloadFile(x: string): Observable<any> {
    const param = new HttpParams().set('filename', x);
    const options = {
      params: param
    };
    return this.http.get('http://localhost:5600/download', { ...options, responseType: 'blob' });
  }
  check_asRead(req_id){
    return this.http.post('http://localhost:3000/check_asRead',{req_id});
  }
  setWorkflow(){

  }
  addLink(work_id,b_id){
    return this.http.post('http://localhost:3000/addLink',{work_id,b_id});
  }
  getFlow(){
    return this.http.get('http://localhost:3000/getFlow');
  }
}
