import { Component} from '@angular/core';
import { UserDataService } from '../Services/UserDataService';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent  {
  userId : number;
  password = '';
  constructor(private userService: UserDataService) {}
  onLogin() {
    
    //User Authentication
    this.userService.authenticateUser1(this.userId, this.password);
  }

}
