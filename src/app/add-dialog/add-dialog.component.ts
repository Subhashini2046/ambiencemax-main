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
   this.role_id= JSON.parse(localStorage.getItem('role_id'));
   this.space= JSON.parse(localStorage.getItem('space'));
    this.userDataService.getRoles(this.req_id,this.role_id,this.space).subscribe((data) => {
      this.users = data;
      console.log(data);
      if (this.role_id>=6) {
        this.users.push({ accessId: 12, roleId: 0, pickRUMPRoleDescription: "Initiator(PNC)", pnc: 1 });
      } 
      console.log(this.users);
    });
  }
  onDisabled(){
    if(this.selectedUser==null){
      return true;
    }
    return false;
  }
  navigateTo() {
    if (this.selectedUser["pnc"] == 1) { this.is_pnc = 1 }
    else
      this.is_pnc = 0;
    console.log(this.selectedUser["accessId"],this.selectedUser["pnc"],this.is_pnc,"//");
 this.router.navigate(['AmbienceMax/viewcomm', this.selectedUser["accessId"], this.req_id, this.is_pnc]);
  }
  onCancel() {
    this.router.navigate(['AmbienceMax/open']);
  }
}




