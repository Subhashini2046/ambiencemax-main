import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {
  constructor(public userDataService: UserDataService) {}
  firstname = '';
  lastname = '';
  email = '';
  password = '';
  address = '';
  designation = '';
  city = '';
  zip: number;
  // onSignUp(){
  //   this.userDataService.NewUser(this.firstname, this.lastname, this.email, this.password,
  //     this.address, this.designation, this.city, this.zip);
  //   this.userDataService.authenticateUser(this.email, this.password);
  // }
  ngOnInit() {
  }

}
