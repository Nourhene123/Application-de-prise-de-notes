import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrls: ['../register/register.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  displayName: string = '';

  constructor(public authService: AuthService,private router:Router) {}

  async signIn() {
    try {
      console.log("trying to sign in")
      await this.authService.signIn(this.email, this.password);
      this.router.navigate(['/home']);

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
