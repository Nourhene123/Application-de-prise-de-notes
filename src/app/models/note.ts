import { Timestamp } from "@angular/fire/firestore";

export interface Note {
  uid: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date |any;
  color: any;
  updatedAt: Date |Timestamp;
  userId: string;
}
