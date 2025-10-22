import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth-service';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async redirectBasedOnRole(): Promise<void> {
    try {
      const user = await this.authService.getCurrentUser();
      console.log('NavigationService: Current user for redirection:', user);
      
      if (!user) {
        console.log('NavigationService: No user found, redirecting to login');
        this.router.navigate(['/login']);
        return;
      }

      if (user.role === 'admin') {
        console.log('NavigationService: User is admin, redirecting to admin page');
        this.router.navigate(['/admin']);
      } else {
        console.log('NavigationService: User is regular user, redirecting to home');
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('NavigationService: Error during role-based redirection:', error);
      this.router.navigate(['/login']);
    }
  }

  async redirectAfterLogin(): Promise<void> {
    // Wait a bit for the authentication state to be fully loaded
    setTimeout(() => {
      this.redirectBasedOnRole();
    }, 1000);
  }
}
