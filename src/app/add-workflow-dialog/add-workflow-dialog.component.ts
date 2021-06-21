import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserDataService } from '../Services/UserDataService';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-add-workflow-dialog',
  templateUrl: './add-workflow-dialog.component.html',
  styleUrls: ['./add-workflow-dialog.component.css']
})
export class AddWorkflowDialogComponent implements OnInit {
  checkoutForm;
  users: any[] = []
  approverArray = [];
  userLocation: any[] = [];
  userRole: any[] = [];
  userRole1: any[] = [];
  user1 = 1;
  role = '';
  selectedRole;
  checkUser = 0;
  countRole = 0;
  checkLocation = 0;
  roleId;
  constructor(public dialogRef: MatDialogRef<AddWorkflowDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public userDataService: UserDataService, private formBuilder: FormBuilder) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createItem() {
    return this.formBuilder.group({
      role: [''],
      user: [''],
      accessId: [''],
      userlist: [[]],
      locationlist: [[]]
    })
  }

  ngOnInit() {
    this.checkoutForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItem()])
    })

    // get all role like intiator,location head etc
    this.userDataService.getUserRole().subscribe((res: any) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i]['pickRUMPRoleDescription'].includes('Initiator')) {
          res[i]['pickRUMPRoleDescription'] = 'Initiator For PNC';
          this.userRole.push(res[i]);
        }
        else {
          this.userRole.push(res[i])
        }
      }
    });

    this.checkoutForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItem()])
    })


  }

  // add the selected data(role,accessId) into createItem() 
  addNext() {
    (this.checkoutForm.controls['items'] as FormArray).push(this.createItem())
  }

  delete(i) {
    (this.checkoutForm.controls['items'] as FormArray).removeAt(i);
    this.checkUser = 0;
    this.checkLocation = 0;
    this.countRole = 0;
  }

  // get admin name
  onChanged(event: any, i: FormGroup) {
    this.roleId = event;
    this.countRole = 0;
  //  this.checkUser = 1;
    let len = this.checkoutForm.value.items.length;
    if (this.roleId != 0) {
      this.checkUser = 1;
      if (this.checkoutForm.value.items[len - 1]["role"] != null) {
        if (this.checkoutForm.value.items[len - 1]["user"].toString() == "") {
          this.checkUser = 1;
        }
      }
    }
    for (let i = 0; i < this.checkoutForm.value.items.length; i++) {
      if (this.checkoutForm.value.items[i]["role"] == this.roleId) {
        this.countRole++;
        console.log(this.countRole, this.roleId);
      }
      if (this.countRole == 2) {
        this.selectedRole = this.userRole[this.checkoutForm.value.items[i]["role"]]['pickRUMPRoleDescription'];
        console.log(this.userRole[this.checkoutForm.value.items[i]["role"]]['pickRUMPRoleDescription']);
        console.log("rrr", this.countRole);
        break;
      }
    }

    console.log("event", event);
    if (this.countRole != 2) {
      this.userDataService.getUsersWorkflow(event).subscribe((res: any) => {
        i.get('userlist').setValue(res);
      });
    }
    if (event == 0 || event == 8) {
      this.userDataService.getUserLocation(event, this.roleId).subscribe((res: any) => {
        // this.userLocation = res;
        i.get('locationlist').setValue(res);
      });
    }
  }

  // get location like speez etc.
  onUsers(userId: any, i: FormGroup) {
    if (this.roleId != 0) {
      this.checkLocation = 1;
      let len = this.checkoutForm.value.items.length;
      if (this.checkoutForm.value.items[len - 1]["user"] != null) {
        this.checkUser = 0;
        if (this.checkoutForm.value.items[len - 1]['accessId'].toString() == "") {
          this.checkLocation = 1;
          console.log("this.checkLocation", this.checkLocation);
        }
      }
    }
    this.userDataService.getUserLocation(userId, this.roleId).subscribe((res: any) => {
      // this.userLocation = res;
      i.get('locationlist').setValue(res);
    });


  }

  onLocation(event) {
    console.log("location", event);
    if (this.roleId != 0) {
      let len = this.checkoutForm.value.items.length;
      if (this.checkoutForm.value.items[len - 1]['accessId'].toString() != "") {
        this.checkLocation = 0;
        // console.log("this.checkLocation",this.checkLocation);
      }
      else if (event != "") {
        this.checkLocation = 0;
        console.log("this.checkLocation", this.checkLocation);
      }
    }
  }
  newWorkflow: any[] = []
  newVal;
  onSubmit() {
    let newVal1;
    let newVal2;
    for (let i = 0; i < this.checkoutForm.value.items.length; i++) {

      if (this.checkoutForm.value.items[i]["role"] == 3) {
        console.log(this.checkoutForm.value.items[i]["accessId"]);
        newVal1 = this.checkoutForm.value.items[i]["accessId"] + 'cor';
        // this.newWorkflow.push(newVal1);
      }
      else if (this.checkoutForm.value.items[i]["role"] == 0) {
        this.newWorkflow.push('i');
      }
      else if (this.checkoutForm.value.items[i]["role"] == 4) {
        newVal2 = this.checkoutForm.value.items[i]["accessId"] + 'e';
        this.newVal = newVal1 + newVal2;
        this.newWorkflow.push(this.newVal);
      }
      else { this.newWorkflow.push(this.checkoutForm.value.items[i]["accessId"]) }
    }
    console.log(this.newWorkflow);
    this.userDataService.addWorkflow(this.newWorkflow).subscribe((res: any) => {
      console.log('inserted');
      alert("Successfully Workflow Added");
      this.dialogRef.close();
    })
    return false;
  }
}