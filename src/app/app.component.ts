import { Component } from '@angular/core';
import { UserDataService } from './Services/UserDataService';

export interface Options {
  name: string;
  func: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  main = this.UsrDataService.main;
  constructor(public UsrDataService: UserDataService) {
  }

  title = 'AmbienceMax';
  logout() {
    this.UsrDataService.main = '';
  }
  ngOnInit() {
    this.main='';
    console.log('ngOnint Dashboard!');
    this.UsrDataService.mainObservable().subscribe( e => {
      this.main = e;
    });}

}
