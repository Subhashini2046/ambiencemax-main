import { Component } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent {
  constructor(public userDataService: UserDataService) {}
  firstname = '';
  lastname = '';
  email = '';
  password = '';
  address = '';
  designation = '';
  city = '';
  zip: number;
 
}
