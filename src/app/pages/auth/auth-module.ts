import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { IonicModule } from '@ionic/angular';
  import { FormsModule } from '@angular/forms';
  import { LoginComponent } from './login/login.component';
  import { AngularFireAuthModule } from '@angular/fire/compat/auth';
  import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AuthRoutingModule } from './auth-routing-module';
import { RegisterComponent } from './register/register.component';

  @NgModule({
    declarations: [LoginComponent,RegisterComponent],
    imports: [
    
      CommonModule,
      IonicModule,
      FormsModule,
      AuthRoutingModule,
      AngularFireAuthModule,
      AngularFirestoreModule
    ]
  })
  export class AuthModule {}