import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { User } from 'src/app/models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges().pipe(
            map(u => u ?? { uid: user.uid, email: user.email ?? '', displayName: user.displayName || '', role: 'user' as const } as User)
          );
        } else {
          return of(null);
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return of(null);
      })
    );
  }

  async signUp(email: string, password: string, displayName: string): Promise<void> {
    if (!email || !password || !displayName) {
      throw new Error('Tous les champs (email, mot de passe, nom d\'affichage) sont requis.');
    }
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      if (!credential.user) {
        throw new Error('Échec de la création de l\'utilisateur, utilisateur non défini.');
      }
      await credential.user.updateProfile({ displayName });
      await this.firestore.doc(`users/${credential.user.uid}`).set({
        uid: credential.user.uid,
        email: credential.user.email,
        displayName,
        role: 'user' as const
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    if (!email || !password) {
      throw new Error('Email et mot de passe sont requis.');
    }
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  async signInWithGoogle(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afAuth.signInWithPopup(provider);
      if (!credential.user) {
        throw new Error('Échec de la connexion avec Google, utilisateur non défini.');
      }
      await this.firestore.doc(`users/${credential.user.uid}`).set({
        uid: credential.user.uid,
        email: credential.user.email,
        displayName: credential.user.displayName || '',
        role: 'user' as const
      }, { merge: true });
    } catch (error) {
      console.error('Erreur lors de la connexion avec Google:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  async setAdminRole(userId: string): Promise<void> {
    try {
      await this.firestore.doc(`users/${userId}`).update({ role: 'admin' as const });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      throw error;
    }
  }
}