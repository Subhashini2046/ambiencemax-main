import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  users1: any = [];
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
      this.space=params['space'];
      this.role_id=params['roleId'];
    });
    //this.accessId = JSON.parse(localStorage.getItem('admin_access_id'));
    // get user role like initiator,location head etc.
    this.userDataService.getRoles(this.req_id, this.role_id, this.space).subscribe((data) => {
      this.users = data;
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i]['pickRUMPRoleDescription'].includes('Initiator')) {
          this.initiatorId = this.users[i]['accessId'];
          this.users[i]['pickRUMPRoleDescription'] = 'Initiator(Request)';
          break;
        }
      }
      if (this.role_id < 6) {
        this.users1.push(this.users[0])
        for (let i = 1; i < this.users.length; i++) {
          this.users1.push(this.users[i])
        }
      }
      if (this.role_id >= 6) {
        this.users1.push(this.users[0])
        this.users1.push({ accessId: this.initiatorId, roleId: 0, pickRUMPRoleDescription: "Initiator(PNC)", pnc: 1 });
        for (let i = 1; i < this.users.length; i++) {
          this.users1.push(this.users[i])
        }
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
    this.router.navigate(['AmbienceMax/viewcomm', this.selectedUser["accessId"], this.req_id, this.is_pnc,this.space,this.role_id]);
  }

  //navigate to all open request page once click on cancel button
  onCancel() {
    this.router.navigate(['AmbienceMax/open']);
  }
}




