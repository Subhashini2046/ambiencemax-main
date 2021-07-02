import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ReqSchema } from './ReqSchema';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class UserDataService {
  changedetectInRole = new BehaviorSubject(null);
  URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }
  constructor(private http: HttpClient, private router: Router, @Inject('AMBI_API_URL') private apiUrl: string) {
    this.URL = apiUrl;
  }
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
    this.http.post<{ result: string, space: string, user_id: string, role_id: number, admin_access_id: number, user_name: string }>
      (this.URL + 'login', { userId, password })
      .subscribe((ResData) => {
        if (ResData.role_id !== undefined) {
          localStorage.setItem('role_id', JSON.stringify(ResData.role_id));
          localStorage.setItem('userId', JSON.stringify(ResData.user_id));
          localStorage.setItem('space', JSON.stringify(ResData.space));
          localStorage.setItem('admin_access_id', JSON.stringify(ResData.admin_access_id));
          localStorage.setItem('user_name', JSON.stringify(ResData.user_name));
          this.router.navigateByUrl('AmbienceMax/dashboard');
        }
      });
  }

  authenticateThroughEquipmax(userId: number) {
    this.http.post<{ result: string, space: string, userId: string, role_id: number, admin_access_id: number, user_name: string }>
      (this.URL + 'login', { userId })
      .subscribe((ResData) => {
        if (ResData.role_id !== undefined) {
          localStorage.setItem('role_id', JSON.stringify(ResData.role_id));
          localStorage.setItem('userId', JSON.stringify(ResData.userId));
          localStorage.setItem('space', JSON.stringify(ResData.space));
          localStorage.setItem('admin_access_id', JSON.stringify(ResData.admin_access_id));
          localStorage.setItem('user_name', JSON.stringify(ResData.user_name));
          this.router.navigateByUrl('AmbienceMax/dashboard');
        }
      });
  }

  //.................Request Count for pending,open,close,Complete................//
  getRequestCount(role, space) {
    return this.http.post(this.URL + 'dashboard', { role, space });
  }

  getPendingRequest(role, space, access_id) {
    return this.http.post(this.URL + 'pendingReq', { role, space, access_id });
  }

  getClosedRequest(role, space, access_id) {
    return this.http.post(this.URL + 'closedReq', { role, space, access_id });
  }

  getAllRequest(role, space, access_id) {
    return this.http.post(this.URL + 'allReq', { role, space, access_id });
  }

  getOpenRequest(role, space, access_id) {
    return this.http.post(this.URL + 'openReq', { role, space, access_id });
  }

  getCompleteRequest(role, space, access_id) {
    return this.http.post(this.URL + 'complete_reqs', { role, space, access_id });
  }

  //.................Mark request status as Complete................//
  addCompleteRequest(req_id, accessID, role_name) {
    return this.http.post<any>(this.URL + 'addCompeteRequest', { req_id, accessID, role_name });
  }

  //.................get vendor Details................//
  getVendorDetails(vendCategoryId) {
    return this.http.post<any>(this.URL + 'vendorDetail', { vendCategoryId });
  }

  getSpocDetails(req_id) {
    return this.http.post<any>(this.URL + 'getSpocs', { req_id });
  }

  //.................get vendorId from dataRumprequest table for HOM ................//
  getVendor(req_id) {
    return this.http.post<any>(this.URL + 'getVendor', { req_id });
  }

  //.................add vendorId once the HOM allocate the Vendor................//
  addVendors(vendorList, req_id, reqComment, accessID, role_name) {
    return this.http.post<any>(this.URL + 'addVendors', { vendorList, req_id, reqComment, accessID, role_name });
  }

  //.................get Request Comment................//
  getHomComment(req_id) {
    return this.http.post<any>(this.URL + 'getComment', { req_id });
  }


  //.................(add Request)................//
  getRequestDetail(req_id) {
    return this.http.post<any>(this.URL + 'requestDetail', { req_id });
  }

  navigateToOpenRequest() {
    this.router.navigate(['/AmbienceMax/open']);
  }

  //.....Add Pnc details once head of maintenance tagged the vendor(addRequest).......//
  addPncByInitiator(allocatedDays, allocationStartDate, actualCost, req_id, VendorPk, filepath, pncfile, accessID, role_name) {
    this.http.post<any>(this.URL + 'addPnc', { allocatedDays, allocationStartDate, actualCost, req_id, VendorPk, accessID, role_name }).subscribe((data) => {
      if (pncfile != null) {
        this.addPncfile(req_id, pncfile);
      }
      this.addPncSupportingDoc(req_id, filepath);
      this.navigateToOpenRequest();
    });
  }
  addPncByInitiator1(allocatedDays, allocationStartDate, actualCost, req_id, VendorPk, filepath, accessID, role_name) {
    this.http.post<any>(this.URL + 'updatePnc', { allocatedDays, allocationStartDate, actualCost, req_id, VendorPk, accessID, role_name }).subscribe((data) => {
      this.addPncSupportingDoc(req_id, filepath);
      this.navigateToOpenRequest();
    });
  }

  pncSumbitWhenDelete(pncfile, allocatedDays, allocationStartDate, actualCost, req_id, VendorPk, filepath, accessID, role_name, delete_pnc_file, delete_pnc_doc) {
    this.http.post<any>(this.URL + 'updatePnc', { allocatedDays, allocationStartDate, actualCost, req_id, VendorPk, accessID, role_name }).subscribe((data) => {
      if (delete_pnc_doc !== '') {
        this.replacePncFile(delete_pnc_doc, pncfile, req_id);
      } 
      if (filepath.length > 0) {
        this.addPncSupportingDoc(req_id, filepath);
      } 
      if (delete_pnc_file.length > 0) {
        this.deleteBOQFile(delete_pnc_file);
      }
      this.navigateToOpenRequest();
    });
  }

  replacePncFile(Pnc_File, replacePncfile, req_id,) {
    this.http.post(this.URL + 'deletePncFile', { Pnc_File, replacePncfile, req_id }).subscribe((ResData) => {
      console.log("PNC file deleted!!");
    });
  }

  addPncSupportingDoc(reqId, filepath) {
    for (let i = 0; i < filepath.length; i++) {
      let fileName = filepath[i];
      this.http.post(this.URL + 'pncSupportingDoc', { req_id: reqId, filepath: fileName })
        .subscribe((ResData) => {
          console.log("Added pnc Supporting Doc!!");
        });
    }
  }

  addPncfile(reqId, filepath) {
    this.http.post(this.URL + 'pncfileUpload', { req_id: reqId, filepath: filepath })
      .subscribe((ResData) => {
        console.log("PNC File Uploaded!!");
      });
  }

  //.................(approve Request)................//
  approveRequest(reqComment, req_id, userId, accessID, role_name) {
    let meType = this.meType;
    return this.http.post<any>(this.URL + 'approveRequest', { reqComment, req_id, userId, accessID, role_name, meType });
  }
  //.................(add Request)................//
  resendRequest(reqComment, req_id, resendToId, accessID, role_name, pnc) {
    return this.http.post<any>(this.URL + 'resendRequest', { reqComment, req_id, resendToId, accessID, role_name, pnc });
  }


  getViewRequestStatus(req_id) {
    return this.http.post<any>(this.URL + 'viewStatuss', { req_id });
  }

  getViewRequestLog(reqId: number) {
    return this.http.post(this.URL + 'viewRequestLog', { reqId });
  }

  getpdfTableData(req_id) {
    return this.http.post(this.URL + 'pdfTableData', { req_id });
  }
  //.................Add new Request(Raise Request)(add Request)................//
  addRequest(newReq: ReqSchema, space, user_name, filepath, accessID) {
    this.http.post(this.URL + 'newReq', { request: newReq, space, accessID }).subscribe((data: any) => {
      this.addToLog(JSON.parse(JSON.stringify(data)).id, user_name, filepath);
      alert('Request created with Request Number: ' + data.reqNumber);
      this.router.navigateByUrl('/AmbienceMax/dashboard');
    });
  }

  updateRequest(is_pnc, request: ReqSchema, accessID, req_id, role_name, filepath, delete_file) {
    this.http.post(this.URL + 'updateRequests', { is_pnc, request: request, accessID, req_id, role_name }).subscribe((res => {
      this.addToLogForUpdateRequest(req_id, role_name, filepath);
      if (delete_file.length > 0) {
        this.deleteBOQFile(delete_file);
      }
      this.navigateToOpenRequest();
    }));
  }

  deleteBOQFile(delete_file) {
    for (let i = 0; i < delete_file.length; i++) {
      let file_Name = delete_file[i].fileName;
      let file_pk = delete_file[i].file_pk;
      this.http.post(this.URL + 'deleteBOQFile', { file_Name: file_Name, file_pk: file_pk })
        .subscribe((ResData) => {
          console.log("file Deleted!!");
        });
    }
  }
  addToLogForUpdateRequest(newReqId, user_name, filepath) {
    for (let i = 0; i < filepath.length; i++) {
      let fileName = filepath[i];
      this.http.post(this.URL + 'fileUpload', { req_id: newReqId, filepath: fileName})
        .subscribe((ResData) => {
          console.log("file uploaded!!");
        });
    }
  }
  addUpdateRequest(RequestData, reqId: number) {
    this.http.post(this.URL + 'updateRequest', { RequestData, reqId }).subscribe((resData) => {
      console.log("Request Updated!!");
    });
  }
  addToLog(newReqId, user_name, filepath) {
    for (let i = 0; i < filepath.length; i++) {
      let fileName = filepath[i];
      this.http.post(this.URL + 'fileUpload', { req_id: newReqId, filepath: fileName })
        .subscribe((ResData) => {
          console.log("File Uploaded");
        });
    }
    this.http.post(this.URL + 'addLogNewReq', { req_id: newReqId, user_name: user_name })
      .subscribe((ResData) => {
        console.log("added to log!!");
      });
  }

  getViewRequestDetail(reqId) {
    return this.http.post(this.URL + 'ViewRequestDetail', { reqId });
  }
  //.................get Request Details (updateRequest)................//
  getRequestDetails(reqId) {
    return this.http.post(this.URL + 'requestDetails', { reqId });
  }

  //.................addBOQDDetails (addRequests)................//
  addBOQDDetails(reqId, role, boqDescription, boqEstimatedCost, boqEstimatedTime, filepath, accessID, role_name, delete_Boq_file) {

    this.http.post(this.URL + 'BOQRequests', { reqId, role, boqDescription, boqEstimatedCost, boqEstimatedTime, accessID, role_name }).subscribe((data: ReqSchema) => {
      this.addBOQfile(reqId, filepath);
      if (delete_Boq_file.length > 0) {
        this.deleteBOQFile(delete_Boq_file);
      }
      this.navigateToOpenRequest();
    });
  }
  addBOQfile(reqId, filepath) {
    for (let i = 0; i < filepath.length; i++) {
      let fileName = filepath[i];
      this.http.post(this.URL + 'fileBoqUpload', { req_id: reqId, filepath: fileName })
        .subscribe((ResData) => {
          console.log("File Uploaded!!");
        });
    }
  }

  //.................get users for Switch role................//
  getUsers(id) {
    return this.http.get(this.URL + `roles?userid=${id}`);
  }

  getRoles(req_id, role_id, space, accessId) {
    return this.http.post(this.URL + 'users1', { req_id, role_id, space, accessId });
  }
  downloadFile(x: string): Observable<any> {
    const param = new HttpParams().set('filename', x);
    const options = {
      params: param
    };
    return this.http.get(this.URL + 'download', { ...options, responseType: 'blob' });
  }
  getRequestFile(req_id) {
    return this.http.post(this.URL + 'getfiles', { req_id });
  }
  getFiles(x: string): Observable<any> {
    const param = new HttpParams().set('filename', x);
    const options = {
      params: param
    };
    return this.http.get(this.URL + 'RequestFle', { ...options, responseType: 'blob' });
  }

  //............mark request as read once any action is performed on request..............// 
  check_asRead(req_id) {
    return this.http.post(this.URL + 'check_asRead', { req_id });
  }

  //.................get locationId,builindId [admin]................// 
  getHierarchy(name) {
    return this.http.post(this.URL + 'getHierarchy', { name });
  }

  //.................get user name from dataadmin for linkToHierarchy [admin]................// 
  getUsersWorkflow(role) {
    return this.http.post(this.URL + 'getUsersWorkflow', { role });
  }
  //.................add w_flow id and b_id in linkrumprequestinitiators [admin]................// 
  addLink(work_id, b_id) {
    return this.http.post(this.URL + 'addLink', { work_id, b_id });
  }

  //.................get existing workflow [admin]................//
  getFlow() {
    return this.http.get(this.URL + 'getFlow');
  }

  //.................get workflow details for existing workflow [admin]................//
  getFlowDetails(Workflow) {
    return this.http.post(this.URL + 'getFlowDetails', { Workflow });
  }

  //.................get location like speez etc. [admin]................//
  getUserLocation(userId, roleId) {
    return this.http.post(this.URL + 'getUserLocation', { userId, roleId });
  }

  //.................get all role from pickrumprole [admin]................//
  getUserRole() {
    return this.http.get(this.URL + 'getUserRole');
  }

  //.................add workflow once workflow generated by admin [admin]................//
  addWorkflow(w_flow) {
    return this.http.post(this.URL + 'addWorkflow', { w_flow });
  }

  //..........get admin id and name for assiging the access priviledge[admin]...........//
  getAdminIdAndName() {
    return this.http.get(this.URL + 'adminIdAndName');
  }

  //.................add admin access [admin]................//
  addAdminId(id) {
    return this.http.post(this.URL + 'addAdminId', { id });
  }

  //check if admin has already privilege or not
  adminCheck(id) {
    return this.http.post(this.URL + 'adminCheck', { id });
  }

  //Revoke access from userF
  revokeAccess(id) {
    return this.http.post(this.URL + 'revokeAccess', { id });
  }

  getwFlow() {
    return this.http.get(this.URL + 'wFlow');
  }

  //save the raise request as Draft Request
  saveDraftRequest(newReq: ReqSchema, space, role_id) {
    return this.http.post(this.URL + 'saveDraftRequest', { request: newReq, space, role_id });
  }

  updateDraftRequest(newReq: ReqSchema, raiseRequestId) {
    return this.http.post(this.URL + 'updateDraftRequest', { request: newReq, raiseRequestId });
  }

  fetchAllDraftRequest(space, role_id) {
    return this.http.post(this.URL + 'fetchAllDraftRequest', { space, role_id });
  }
  
  fetchDraftRequest(draftReqId) {
    return this.http.post(this.URL + 'fetchDraftRequest', { draftReqId });
  }

  deleteDraftReques(draftReqId) {
    return this.http.post(this.URL + 'deleteDraftRequest', { draftReqId });
  }

  cancelRequest(req_id) {
    return this.http.post(this.URL + 'cancelRequest', { req_id });
  }
}
