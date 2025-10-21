import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  displayName: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async signUp() {
    try {
      await this.authService.signUp(this.email, this.password, this.displayName);
      console.log('Inscription réussie !');
      this.router.navigate(['/login']); // Redirige vers la page de connexion après inscription
    } catch (error) {
      console.error('Échec de l\'inscription:', error);
      // Vous pouvez ajouter une alerte ou un message pour l'utilisateur ici
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  isFormValid(): boolean {
    return this.email.trim() !== '' && this.password.trim() !== '' && this.displayName.trim() !== '';
  }
}