import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  displayName: string = '';

  constructor(public authService: AuthService) {}

  async signUp() {
    try {
      await this.authService.signUp(this.email, this.password, this.displayName);
    } catch (error) {
      console.error('Échec de l\'inscription:', error);
    }
  }

  async signIn() {
    try {
      await this.authService.signIn(this.email, this.password);
    } catch (error) {
      console.error('Échec de la connexion:', error);
    }
  }

  async signInWithGoogle() {
    try {
      await this.authService.signInWithGoogle();
    } catch (error) {
      console.error('Échec de la connexion avec Google:', error);
    }
  }
}