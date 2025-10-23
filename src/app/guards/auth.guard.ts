import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    return this.auth.isLoggedIn().then(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      } else {
        this.router.navigate(['/auth/login']);
        return false;
      }
  });
}
}
