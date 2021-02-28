import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';


import { ReqSchema } from '../Services/ReqSchema';
@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit {
  accessId;
  allocateForm: FormGroup;
  req_id;
  users: any = [];
  constructor(private fb1: FormBuilder, private router: Router,
    private actrouter: ActivatedRoute, public userDataService: UserDataService) {

    this.allocateForm = this.fb1.group({
      request_actionnnn: ['', Validators.required]

    });
  }
  ngOnInit() {
    this.actrouter.params.subscribe(params => {
      this.req_id = +params['id'];
    });
    this.accessId = JSON.parse(localStorage.getItem('admin_access_id'));
    this.userDataService.getRoles(this.req_id,this.accessId).subscribe((data) => {
      this.users = data;
    })
  }
  navigateTo() {
    this.router.navigate(['AmbienceMax/viewcomm', this.accessId, this.req_id]);
  }
  onCancel() {
    this.router.navigate(['AmbienceMax/open']);
  }
}




