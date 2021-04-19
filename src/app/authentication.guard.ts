import { Observable } from 'rxjs';
import { AuthGuardService } from './Services/AuthGuardService';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private Authguardservice: AuthGuardService, private router: Router) {}
  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
  //   return this
  // }
  canActivate(): boolean {  
    if (!this.Authguardservice.gettoken()) {  
        this.router.navigateByUrl("/login");  
    }  
    return this.Authguardservice.gettoken();  
}  

  
}
