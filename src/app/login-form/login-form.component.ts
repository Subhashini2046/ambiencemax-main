import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  email = '';
  password = '';
  // tslint:disable-next-line: no-shadowed-variable
  constructor(private UserDataService: UserDataService) {}
  onLogin() {
    console.log(this.email);
    this.UserDataService.authenticateUser(this.email, this.password);
  }
  ngOnInit() {}

}
