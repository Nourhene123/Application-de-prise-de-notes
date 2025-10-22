import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  authService = inject(AuthService);
  navigationService = inject(NavigationService);

  constructor(private router: Router) {}

  async signUp() {
    try {
      await this.authService.signUp(this.email, this.password, this.firstName, this.lastName);
      console.log('Inscription réussie !');
      console.log("Registration successful, redirecting based on role...");
      await this.navigationService.redirectAfterLogin();
    } catch (error) {
      console.error('Échec de l\'inscription:', error);
      // Vous pouvez ajouter une alerte ou un message pour l'utilisateur ici
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  isFormValid(): boolean {
    return this.email.trim() !== '' && this.password.trim() !== '' && this.firstName.trim() !== '' && this.lastName.trim() !== '';
  }
}
