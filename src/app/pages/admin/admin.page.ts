import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { Note } from 'src/app/models/note';
import { AuthService } from 'src/app/services/auth-service';
import { NotesService } from 'src/app/services/notes-service';
import { UserService } from 'src/app/services/user-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AdminPage implements OnInit {

  users$: Observable<User[]>;
  notes$: Observable<Note[]>;
  currentUser: User | null = null;
  selectedTab: 'users' | 'notes' = 'users';
  loading = false;
  error: string | null = null;

  // User management
  editingUser: User | null = null;
  newUser: Partial<User> = { 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '', 
    role: 'user' 
  };

  private authService = inject(AuthService);
  private notesService = inject(NotesService);
  private userService = inject(UserService);
  private router = inject(Router);

  constructor() {
    this.users$ = this.userService.getAllUsers();
    this.notes$ = this.notesService.getNotes();
  }

  async ngOnInit() {
    this.currentUser = await this.authService.getCurrentUser();
    console.log('Current admin user:', this.currentUser);
    
    // Check if user is admin
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      this.error = 'Accès non autorisé. Seuls les administrateurs peuvent accéder à cette page.';
      return;
    }
  }

  setTab(tab: any) {
    if (tab === 'users' || tab === 'notes') {
      this.selectedTab = tab;
      this.error = null;
    }
  }

  async createUser() {
    if (!this.newUser.email || !this.newUser.firstName || !this.newUser.lastName) {
      this.error = 'Tous les champs sont requis';
      return;
    }

    try {
      this.loading = true;
      await this.userService.createUser(this.newUser as User);
      this.newUser = { firstName: '', lastName: '', email: '', password: '', role: 'user' };
      this.error = null;
    } catch (error) {
      this.error = 'Erreur lors de la création de l\'utilisateur';
      console.error('Error creating user:', error);
    } finally {
      this.loading = false;
    }
  }

  async updateUser(user: User) {
    try {
      this.loading = true;
      await this.userService.updateUser(user.uid, user);
      this.editingUser = null;
      this.error = null;
    } catch (error) {
      this.error = 'Erreur lors de la mise à jour de l\'utilisateur';
      console.error('Error updating user:', error);
    } finally {
      this.loading = false;
    }
  }

  async deleteUser(userId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        this.loading = true;
        await this.userService.deleteUser(userId);
        this.error = null;
      } catch (error) {
        this.error = 'Erreur lors de la suppression de l\'utilisateur';
        console.error('Error deleting user:', error);
      } finally {
        this.loading = false;
      }
    }
  }

  async deleteNote(noteId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        this.loading = true;
        await this.notesService.deleteNote(noteId);
        this.error = null;
      } catch (error) {
        this.error = 'Erreur lors de la suppression de la note';
        console.error('Error deleting note:', error);
      } finally {
        this.loading = false;
      }
    }
  }

  getUserDisplayName(userId: string): string {
    let displayName = 'Utilisateur inconnu';
    this.users$.subscribe(users => {
      const user = users.find(u => u.uid === userId);
      if (user) {
        displayName = `${user.firstName} ${user.lastName}`;
      }
    });
    return displayName;
  }

  startEditUser(user: User) {
    this.editingUser = { ...user };
  }

  cancelEditUser() {
    this.editingUser = null;
  }

  async signOut() {
    try {
      await this.authService.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}
