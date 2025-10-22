import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private auth: AuthService, 
    private router: Router
  ) {}

  canActivate() {
    return this.auth.isLoggedIn().then(async isLoggedIn => {
      if (isLoggedIn) {
        // User is logged in, now check if they are admin
        const user = await this.auth.getCurrentUser();
        console.log('AdminGuard: Current user:', user);
        
        if (user && user.role === 'admin') {
          console.log('AdminGuard: User is admin, access granted');
          return true;
        } else {
          console.log('AdminGuard: User is not admin, redirecting to login');
          this.router.navigate(['/login']);
          return false;
        }
      } else {
        console.log('AdminGuard: User not logged in, redirecting to login');
        this.router.navigate(['/login']);
        return false;
      }
    });
  }
}
