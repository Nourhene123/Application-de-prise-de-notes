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
import { map } from 'rxjs/operators';
import { Note } from 'src/app/models/note';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  private notesCollection = collection(this.firestore, 'notes');

  constructor(private firestore: Firestore) {}

  async addNote(note: Note): Promise<void> {
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

    return collectionData(q, { idField: 'uid' }).pipe(
      map((notes: any[]) =>
        notes.map(note => ({
          ...note,
          createdAt: note.createdAt instanceof Timestamp
            ? note.createdAt.toDate()
            : note.createdAt,
          updatedAt: note.updatedAt instanceof Timestamp
            ? note.updatedAt.toDate()
            : note.updatedAt,
        }))
      )
    );
  }

  getNoteById(id: string): Observable<Note | undefined> {
    const noteDocRef = doc(this.firestore, `notes/${id}`);
    return docData(noteDocRef, { idField: 'uid' }).pipe(
      map((note: any) => note ? {
        ...note,
        createdAt: note.createdAt instanceof Timestamp
          ? note.createdAt.toDate()
          : note.createdAt,
        updatedAt: note.updatedAt instanceof Timestamp
          ? note.updatedAt.toDate()
          : note.updatedAt,
      } : undefined)
    );
  }

  getNotesByUserId(userId: string): Observable<Note[]> {
    const q = query(this.notesCollection, where('userId', '==', userId));
    return collectionData(q, { idField: 'uid' }).pipe(
      map((notes: any[]) =>
        notes.map(note => ({
          ...note,
          createdAt: note.createdAt?.toDate ? note.createdAt.toDate() : note.createdAt,
          updatedAt: note.updatedAt?.toDate ? note.updatedAt.toDate() : note.updatedAt,
        }))
      )
    );
  }

  async updateNote(id: string, data: Partial<Note>): Promise<void> {
    const noteDocRef = doc(this.firestore, `notes/${id}`);
    await updateDoc(noteDocRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  async deleteNote(id: string): Promise<void> {
    const noteDocRef = doc(this.firestore, `notes/${id}`);
    await deleteDoc(noteDocRef);
  }
}
