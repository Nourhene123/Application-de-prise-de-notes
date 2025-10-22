import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersCollection = collection(this.firestore, 'users');

  constructor(private firestore: Firestore) {}

  // Get all users
  getAllUsers(): Observable<User[]> {
    return collectionData(this.usersCollection, { idField: 'uid' }) as Observable<User[]>;
  }

  // Get user by ID
  getUserById(id: string): Observable<User | undefined> {
    const userDocRef = doc(this.firestore, `users/${id}`);
    return docData(userDocRef, { idField: 'uid' }) as Observable<User | undefined>;
  }

  // Create a new user
  async createUser(user: User): Promise<void> {
    await addDoc(this.usersCollection, {
      ...user,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }

  // Update user
  async updateUser(id: string, data: Partial<User>): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${id}`);
    await updateDoc(userDocRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${id}`);
    await deleteDoc(userDocRef);
  }

  // Get users by role
  getUsersByRole(role: 'user' | 'admin'): Observable<User[]> {
    const q = query(this.usersCollection, where('role', '==', role));
    return collectionData(q, { idField: 'uid' }) as Observable<User[]>;
  }

  // Search users by name or email
  searchUsers(searchTerm: string): Observable<User[]> {
    // Note: Firestore doesn't support full-text search natively
    // This would need to be implemented with a more complex query or external service
    return this.getAllUsers();
  }
}
