import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit {
  accessId;
  selectedUser;
  allocateForm: FormGroup;
  req_id;
  users: any = [];
  is_pnc;
  initiatorId;
  constructor(private fb1: FormBuilder, private router: Router,
    private actrouter: ActivatedRoute, public userDataService: UserDataService) {

    this.allocateForm = this.fb1.group({
      request_actionnnn: ['', Validators.required]

    });
  }
  role_id;
  space;
  ngOnInit() {
    this.actrouter.params.subscribe(params => {
      this.req_id = +params['id'];
      this.is_pnc = +params['pnc'];
    });
    this.accessId = JSON.parse(localStorage.getItem('admin_access_id'));
    this.role_id = JSON.parse(localStorage.getItem('role_id'));
    this.space = JSON.parse(localStorage.getItem('space'));

    // get user role like initiator,location head etc.
    this.userDataService.getRoles(this.req_id, this.role_id, this.space,this.accessId ).subscribe((data) => {
      this.users = data;
      for(let i=0;i<this.users.length;i++){
        if(this.users[i]['pickRUMPRoleDescription'].includes('Initiator')){
          this.initiatorId=this.users[i]['accessId']
        break;}
      }
      if (this.role_id >= 6) {
        this.users.push({ accessId: this.initiatorId, roleId: 0, pickRUMPRoleDescription: "Initiator(PNC)", pnc: 1 });
      }
    });
  }

  //disable the submit button if blank 
  onDisabled() {
    if (this.selectedUser == null) {
      return true;
    }
    return false;
  }

  // navigate to view Comment page where user is responsible to enter there comment for particular request
  navigateTo() {
    if (this.selectedUser["pnc"] == 1) { this.is_pnc = 1 }
    else
      this.is_pnc = 0;
    this.router.navigate(['AmbienceMax/viewcomm', this.selectedUser["accessId"], this.req_id, this.is_pnc]);
  }

  //navigate to all open request page once click on cancel button
  onCancel() {
    this.router.navigate(['AmbienceMax/open']);
  }
}




