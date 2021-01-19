import { Component, ViewChild,OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { format } from 'url';
import { ReqSchema } from '../Services/ReqSchema';
import {FormsModule} from "@angular/forms";
import {FileUploader,FileSelectDirective} from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
const URL = 'http://localhost:5600/api';
//const uri = 'http://localhost:5600/file/upload';
@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements OnInit {
  public userId;
  AllFileName:any[]=[];
areCredentialsInvalid = false;
public filepath=[];
public fieldValue= [];
uploader:FileUploader;
  hasBaseDropZoneOver:boolean;
  hasAnotherDropZoneOver:boolean;
  response:string;


  title = 'fileUpload';
  images;
  multipleImages = [];
 // uploader:FileUploader = new FileUploader({url:uri});
  attachmentList:any = [];
  constructor(private http: HttpClient, public UserDataService: UserDataService , private _snackBar: MatSnackBar,private router: Router) {
  //   this.uploader.onCompleteItem = (item:any, response:any , status:any, headers:any) => {
  //     this.attachmentList.push(JSON.parse(response));
  // }

  this.uploader = new FileUploader({
    url: URL,
    disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
    formatDataFunctionIsAsync: true,
    formatDataFunction: async (item) => {
      return new Promise( (resolve, reject) => {
        resolve({
          name: item._file.name,
          length: item._file.size,
          contentType: item._file.type,
          date: new Date()
        });
      });
    }
  });

  this.hasBaseDropZoneOver = false;
  this.hasAnotherDropZoneOver = false;

  this.response = '';

  this.uploader.response.subscribe( res => this.response = res );
}
  Approvers = [];
  num = 0;
  //reqno = this.RequestsDataService.allRequests.length + 1;
  currReq: ReqSchema = {
    req_date: '' ,
    req_description: '',
    req_id: 0,
    req_initiator_id: this.UserDataService.userId,
    req_level: 1,
    req_status: 'Pending',
    req_title: '',
    req_type: '',
    w_id: 0,
    req_budget: 0
  };
 ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('userId'));
    console.log('user_id',this.userId);
    this.currReq.req_initiator_id=this.userId;
  }
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }
  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
    }
  }

  selectMultipleImage(event){
    if (event.target.files.length > 0) {
      this.multipleImages = event.target.files;
    }
  }


  onMultipleSubmit(){
  
    var filesize=0;
    const formData = new FormData();
    console.log("nnnnn",this.multipleImages)
    for(let img of this.multipleImages){
      formData.append('files', img);
     filesize+=img['size'];
     console.log("/////",img)
     console.log("///",formData)
    }
    var fileInMB=10485760;
    if(filesize>fileInMB){
      console.log("lll",filesize>fileInMB);
      this.areCredentialsInvalid = true;
      return;
    }
    console.log("lll");
  //   this.http.post<any>('http://localhost:5600/multipleFiles', formData).subscribe((res) =>{
  //     for (let i = 0; i < res.files.length; i++) { 
  //       this.filepath[i]=res.files[i]['path'];
  //       this.fieldValue[i]=res.files[i]['originalname'];
  //  // console.log(this.filepath);
  //     }
  //     console.log("nnnnnhh",this.fieldValue);
  // });
  }
  @ViewChild('attachments',{static: false}) attachment: any;

  fileList: File[] = [];
  listOfFiles: any[] = [];
  
  onFileChanged(event: any) {
    var filesize=0;
      for (var i = 0; i <= event.target.files.length - 1; i++) {
        var selectedFile = event.target.files[i];
        this.fileList.push(selectedFile);
        filesize+=this.fileList[i]['size'];
        this.listOfFiles.push(selectedFile.name);
    }
    var fileInMB=10485760;
    if(filesize>fileInMB){
      console.log("lll",filesize>fileInMB);
      this.areCredentialsInvalid = true;
      return;
    }
    console.log("mmmm",this.fileList);
    this.attachment.nativeElement.value = '';
  }
  
  
  
  removeSelectedFile(index) {
   // Delete the item from fileNames list
   this.listOfFiles.splice(index, 1);
   // delete file from FileList
   this.fileList.splice(index, 1);
  }
  onSubmit() {
    const formData = new FormData();
    for (let img of this.fileList) {
      console.log("gggg",img);
      formData.append('files', img);
      console.log("///",formData)
  }
    this.http.post<any>('http://localhost:5600/multipleFiles', formData).subscribe((res) =>{
      for (let i = 0; i < res.files.length; i++) { 
        this.filepath[i]=res.files[i]['path'];
        console.log("nnnnnhh",this.filepath[i]);
      }
  });
    this.openSnackBar('Request Submitted Successfully !');

    this.UserDataService.addRequest(this.currReq,this.filepath);
    this.currReq.req_initiator_id = this.UserDataService.userId;
    this.UserDataService.main = '';
    this.UserDataService.mainSub.next(this.UserDataService.main);
    this.router.navigateByUrl('/dashboard');
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 3500,
      panelClass: ['simple-snack-bar']
    });
  }
}
