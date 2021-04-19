import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService{

  constructor() { }
  gettoken(){  
    return !!localStorage.getItem("userId");  
    }  
}
