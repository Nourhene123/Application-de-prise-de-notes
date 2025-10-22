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
import { Note } from 'src/app/models/note';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  private notesCollection = collection(this.firestore, 'notes');

  constructor(private firestore: Firestore) {}


  async addNote(note:Note): Promise<void> {
    const createdAt = Timestamp.now();
    const updatedAt = Timestamp.now();

    await addDoc(this.notesCollection, {
      ...note,
      createdAt,
      updatedAt
    });
  }

  getNotes(userId?: string): Observable<Note[]> {
    const q = userId
      ? query(this.notesCollection, where('userId', '==', userId))
      : this.notesCollection;

    return collectionData(q, { idField: 'uid' }) as Observable<Note[]>;
  }

  // ✅ Get a single note by ID
  getNoteById(id: string): Observable<Note | undefined> {
    const noteDocRef = doc(this.firestore, `notes/${id}`);
    return docData(noteDocRef, { idField: 'uid' }) as Observable<Note | undefined>;
  }

  getNotesByUserId(userId: string | undefined): Observable<Note[]> {
    const q = query(this.notesCollection, where('userId', '==', userId));
    return collectionData(q, { idField: 'uid' }) as Observable<Note[]>;
  }

  // ✅ Update a note
  async updateNote(id: string, data: Partial<Note>): Promise<void> {
    const noteDocRef = doc(this.firestore, `notes/${id}`);
    await updateDoc(noteDocRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  // ✅ Delete a note
  async deleteNote(id: string): Promise<void> {
    const noteDocRef = doc(this.firestore, `notes/${id}`);
    await deleteDoc(noteDocRef);
  }
}
