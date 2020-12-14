import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { RequestService} from'../Services/RequestService';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  providers:[RequestService]
})
export class LoginFormComponent implements OnInit {
  email = '';
  password = '';
  // tslint:disable-next-line: no-shadowed-variable
  constructor(private UserDataService: UserDataService,public requestService: RequestService) {}
  onLogin() {
    console.log(this.email);
    this.UserDataService.authenticateUser1(this.email, this.password);
    //this.requestService.authenticateUser(this.email, this.password);
  }
  ngOnInit() {}

}
