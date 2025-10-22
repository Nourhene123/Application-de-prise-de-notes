import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { Observable, Subscription } from 'rxjs';
import { Note } from 'src/app/models/note';
import { AuthService } from 'src/app/services/auth-service';
import { NotesService } from 'src/app/services/notes-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  notes$: Observable<Note[]>;
  currentUser: User | null = null;

  notes = [
    { title: 'Shopping List', content: 'Milk, Bread, Eggs, Coffee', createdAt: new Date(), color: '#FFECB3' },
    { title: 'Workout Plan', content: 'Leg day at 6 PM', createdAt: new Date(), color: '#C8E6C9' },
    { title: 'Meeting Notes', content: 'Discuss project roadmap with team', createdAt: new Date(), color: '#BBDEFB' },
    { title: 'Ideas', content: 'Start a new blog about coding tips', createdAt: new Date(), color: '#F8BBD0' },
    { title: 'Reminder', content: 'Pay electricity bill before Friday', createdAt: new Date(), color: '#FFE0B2' },
  ];


  constructor(private notesService: NotesService , private authService:AuthService) {
    this.notes$ = this.notesService.getNotes();
  }

  async ngOnInit() {
    this.currentUser = await this.authService.getCurrentUser();
    console.log('Current user:', this.currentUser);
  }


  getNotes() {
    this.notesService.getNotesByUserId(this.currentUser?.uid).subscribe(notes => {
      console.log(notes);
    });
  }

  updateNote(noteId: string) {
    this.notesService.updateNote(noteId, { title: 'Updated Title' });
  }

  deleteNote(noteId: string) {
    this.notesService.deleteNote(noteId);
  }

}
