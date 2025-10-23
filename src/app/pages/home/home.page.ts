import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { Note } from 'src/app/models/note';
import { AuthService } from 'src/app/services/auth-service';
import { NotesService } from 'src/app/services/notes-service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {


  //notes$: Observable<Note[]>;
  currentUser: User | null = null;

  newNote: Partial<Note> = {
    title: '',
    content: '',
    tags: [],
  };

  tagsInput: string = '';


  notes: Note[] = [];


  constructor(
    private notesService: NotesService ,
    private authService:AuthService,
    private router:Router,
    private toastController: ToastController
  ) {

    }

  async ngOnInit() {
    this.currentUser = await this.authService.getCurrentUser();
    console.log('Current user:', this.currentUser);

    this.notesService.getNotesByUserId(this.currentUser!.uid).subscribe(notes => {
      console.log("user id ", this.currentUser?.uid);
      this.notes = notes;
    });
  }


  getNotesByUserId() {
    this.notesService.getNotesByUserId(this.currentUser!.uid).subscribe(notes => {
      console.log(notes);
    });
  }

  updateNote(noteId: string) {
    this.notesService.updateNote(noteId, { title: 'Updated Title' });
  }


  openAddNote() {
    this.router.navigate(['add-note']);
  }


  async createNote() {
  if (!this.currentUser) {
    console.error('Utilisateur non connecté');
    return;
  }

  const note: Note = {
    uid: '',
    title: this.newNote.title || '',
    content: this.newNote.content || '',
    tags: this.tagsInput ? this.tagsInput.split(',').map(tag => tag.trim()) : [],
    createdAt: new Date(),
    updatedAt: new Date(),
    color:this.newNote.color ,
    userId: this.currentUser.uid,
    imageUrl: this.newNote.imageUrl || '',
  };

  try {
    await this.notesService.addNote(note);
    this.getNotesByUserId();
    console.log('Note ajoutée avec succès !');
    this.newNote = { title: '', content: '', tags: [] };
    this.tagsInput = '';
    this.showToast('Note ajoutée avec succès !', 'success');
  } catch (error) {
    console.error('Erreur lors de la création de la note :', error);
  }
}

  selectedNoteId: string | null = null;
  onNoteClick(note: Note) {
    if (this.selectedNoteId === note.uid) {
      // Second click: delete the note
      this.selectedNoteId = null;
    } else {
      // First click: select note
      this.selectedNoteId = note.uid;
    }
  }

  deleteNote(note: Note) {
    this.notesService.deleteNote(note.uid).then(() => {
      this.notes = this.notes.filter(n => n.uid !== note.uid);
      this.showToast('Note supprimée avec succès !', 'success');
    });
  }

  isSelected(note: Note): boolean {
    return this.selectedNoteId === note.uid;
  }

  async signOut() {
    try {
      await this.authService.signOut();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Error signing out:', error);
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

  async addImage() {
    console.log('Adding image to note...');
  try {
    console.log('Opening camera to take photo...');
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });

    this.newNote.imageUrl = image.dataUrl;
  } catch (err) {
    console.error('Camera error:', err);
  }
}

}
