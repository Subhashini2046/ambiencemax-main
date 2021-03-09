import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserDataService } from '../Services/UserDataService';
import { FormGroup,FormBuilder,FormArray,Validators } from '@angular/forms';
@Component({
  selector: 'app-add-workflow-dialog',
  templateUrl: './add-workflow-dialog.component.html',
  styleUrls: ['./add-workflow-dialog.component.css']
})
export class AddWorkflowDialogComponent implements OnInit {
  checkoutForm;
  users:any[]=[]
  approverArray = [];
  userLocation:any[]=[];
  userRole:any[]=[];
  constructor( public dialogRef: MatDialogRef<AddWorkflowDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,public userDataService: UserDataService,private formBuilder: FormBuilder) {
     }
  onNoClick(): void {
      this.dialogRef.close();
    }

    createItem() {
      return this.formBuilder.group({
        role:['Jon'],
        user:['Jon'],
        accessId:['Jon'],
      })
    }

  ngOnInit() {
    this.checkoutForm= this.formBuilder.group({
      items: this.formBuilder.array([this.createItem()])
    })
this.userDataService.getUserRole().subscribe((res:any)=>{
  this.userRole=res;
console.log(res);
});

this.checkoutForm = this.formBuilder.group({
  items: this.formBuilder.array([this.createItem()])
})
  }
 

  addNext() {
    (this.checkoutForm.controls['items'] as FormArray).push(this.createItem())
  }

  roleId;
  onChanged(event: any) {
    this.roleId=event;
    console.log("event",event);
    if(this.roleId!=0){
    this.userDataService.getUsersWorkflow(event).subscribe((res:any) => {
     this.users=res;
      console.log(this.users);
    });}
  }
  onUsers(userId:any){
    this.userDataService.getUserLocation(userId,this.roleId).subscribe((res:any) => {
     
      this.userLocation=res;
      console.log(res);
    }); 

  }
newWorkflow:any[]=[]
newVal;
onSubmit(){
  for(let i=0;i<this.checkoutForm.value.items.length;i++){

    if(this.checkoutForm.value.items[i]["role"]==3){
      this.newVal=this.checkoutForm.value.items[i]["accessId"]+'cor';
    }
    else if(this.checkoutForm.value.items[i]["role"]==0){
      this.newWorkflow.push('i');
    }
   else if(this.checkoutForm.value.items[i]["role"]==4){
    let newVal1=this.checkoutForm.value.items[i]["accessId"]+'e';
     this.newVal=this.newVal+newVal1
      this.newWorkflow.push(this.newVal);
    }
    else
    {this.newWorkflow.push(this.checkoutForm.value.items[i]["accessId"])}
  }
  this.userDataService.addWorkflow(this.newWorkflow).subscribe((res:any)=>{
    console.log('inserted');
  })
  console.log(this.newWorkflow);
  console.log(this.checkoutForm.value.items);
  return false;
}
}
