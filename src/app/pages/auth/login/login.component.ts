import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { NavigationService } from '../../../services/navigation.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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

  constructor(
    public authService: AuthService,
    private navigationService: NavigationService,
    private toastController: ToastController
  ) {}

  async signIn() {
    try {
      console.log("trying to sign in");
      await this.authService.signIn(this.email, this.password);
      console.log("Login successful, redirecting based on role...");
      this.showToast('Connexion réussie !', 'success');
      await this.navigationService.redirectAfterLogin();
    } catch (error) {
      this.showToast('Échec de la connexion. Veuillez vérifier vos informations.', 'danger');
      console.error('Échec de la connexion:', error);
    }
  }

  async signInWithGoogle() {
    try {
      await this.authService.signInWithGoogle();
      console.log("Google login successful, redirecting based on role...");
      await this.navigationService.redirectAfterLogin();
    } catch (error) {
      console.error('Échec de la connexion avec Google:', error);
    }
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning' | 'medium') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color, 
      icon: color === 'success' ? 'checkmark-circle-outline' : 'trash-outline',
    });
    await toast.present();
  }
}
