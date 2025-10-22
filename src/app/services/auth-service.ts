import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import firebase from 'firebase/compat/app';
import { firstValueFrom, Observable, of } from 'rxjs';
import { User } from 'src/app/models/User';
import { onAuthStateChanged, User as FirebaseUser } from '@angular/fire/auth';
import { docData } from '@angular/fire/firestore';
import { switchMap, catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User | null>;

  constructor(private afAuth: Auth, private firestore: Firestore) {

  this.user$ = new Observable<User | null>(subscriber => {
    onAuthStateChanged(this.afAuth, async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        subscriber.next(null);
        return;
      }

      try {
        const userDocRef = doc(this.firestore, `users/${firebaseUser.uid}`);
        const userData$ = docData(userDocRef, { idField: 'uid' }) as Observable<User | undefined>;

        userData$.pipe(
          map(u => u ?? {
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            role: 'user',
           } as User),
          catchError(err => {
            console.error('Erreur Firestore:', err);
            return of(null);
          })
        ).subscribe(subscriber);

      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        subscriber.next(null);
      }
    });
  });
}

  async signUp(email: string, password: string, firstname :string, lastname:string): Promise<void> {
    if (!email || !password || !firstname || !lastname) {
      throw new Error('Tous les champs (email, mot de passe, nom d\'affichage) sont requis.');
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(this.afAuth, email, password);
      const user = userCredential.user;
      await setDoc(doc(this.firestore, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        firstName: firstname,
        lastName: lastname,
        role: 'user'
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
      console.log('trying to sign in service')
      await signInWithEmailAndPassword(this.afAuth,email, password);

    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  async signInWithGoogle(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await signInWithPopup(this.afAuth,provider);
      if (!credential.user) {
        throw new Error('Échec de la connexion avec Google, utilisateur non défini.');
      }
      await setDoc(doc(this.firestore,`users/${credential.user.uid}`),{
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

  // async setAdminRole(userId: string): Promise<void> {
  //   try {
  //     await this.firestore.doc(`users/${userId}`).update({ role: 'admin' as const });
  //   } catch (error) {
  //     console.error('Erreur lors de la mise à jour du rôle:', error);
  //     throw error;
  //   }
  // }

  async isLoggedIn(): Promise<boolean> {
    const user = await this.afAuth.currentUser;
    return !!user;
  }

  async getCurrentUser(): Promise<User | null> {
  const firebaseUser = await this.afAuth.currentUser;
  if (!firebaseUser) return null;

  // Get the user's document from Firestore
  const userDocRef = doc(this.firestore, `users/${firebaseUser.uid}`);
  const userData = await firstValueFrom(docData(userDocRef, { idField: 'uid' })) as User | undefined;

  // Return Firestore data if exists, otherwise build a fallback object
  return userData ?? {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    firstName: '',        // placeholder if missing
    lastName: '',
    role: 'user',
  } as User;
}
}
