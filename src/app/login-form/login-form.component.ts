import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  userId : number;
  password = '';
  constructor(private UserDataService: UserDataService) {}
  onLogin() {
    console.log(this.userId);
    this.UserDataService.authenticateUser1(this.userId, this.password);
  
  }
  ngOnInit() {}

}
