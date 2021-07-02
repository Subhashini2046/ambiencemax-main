import { Component} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  state = 'login';

  loginClicked(){
    this.state = 'login';
  }
  signupClicked(){
    this.state = 'signup';
  }
}
