import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { ReqSchema } from '../Services/ReqSchema';
import { MatSnackBar } from '@angular/material';
import {FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-viewcomm',
  templateUrl: './viewcomm.component.html',
  styleUrls: ['./viewcomm.component.css']
})
export class ViewcommComponent implements OnInit {
  title = 'ambiencemax';
  view: ReqSchema;
  // allocateForm:FormGroup;
  // users:any=[];
  comment = '';
  userRole='';
  Approvers = [];
  appExists = false;
  constructor(public userDataService: UserDataService , private route: Router,  private router: Router,public snackBar: MatSnackBar) {
    // this.allocateForm = this.fb1.group({
    //   user: ['', Validators.required]
     
    // }
    // );
  

    this.view = this.userDataService.viewReq;
    if (this.userDataService.userRole !== null) {
      localStorage.setItem('viewReq', JSON.stringify(this.view));
      console.log(this.view);
    }
  }
  currReqApprovers = [];
  submitFeedback() {
    // this.userDataService.viewReq.comment.push(this.comment);
    // this.userDataService.viewReq.status = 'UnderNeg';
    // console.log(this.userDataService.viewReq.comment);
  }
// btnClick=function(){
//   this.router.navigate(['add-dialog']);
// }
goToUpgrade() {
  
  //this.router.navigate(['/dialogg']);

}
goToRequestAction(req_id) {
  this.route.navigate(['/reqform', req_id]);
  console.log(req_id);
}

  onSubmit() {
    // console.log(this.currReqApprovers);
    // this.userDataService.viewReq.status = 'Pending';
    // console.log(this.userDataService.viewReq.status);
    // if (this.userDataService.currUser.designation === 'admin') {
    //   this.currReqApprovers.forEach( e => {
    //     this.userDataService.addApprovers(this.view, e );
    //   });
    // }
  }

  ngOnInit() {
    // this.userDataService.getusers().subscribe((data)=>{
    //   this.users=data;
    // })
    if ( this.userDataService.viewReq === null || this.userDataService.viewReq === undefined) {
      this.userDataService.viewReq = JSON.parse(localStorage.getItem('viewReq'));
      this.userDataService.toBeApproved = JSON.parse(localStorage.getItem('toBeApproved'));
      // console.log(JSON.parse(localStorage.getItem('toBeApproved')));
      console.log(this.userDataService.viewReq);
      this.view = this.userDataService.viewReq;
      console.log(this.view);
      this.userDataService.message = JSON.parse(localStorage.getItem('message'));
      this.userDataService.userRole = JSON.parse(localStorage.getItem('userData')).userRole;
    }
    console.log(localStorage);
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 3500,
      panelClass: ['simple-snack-bar']

    });
    this.router.navigateByUrl('dashboard/open');
  }
}

  