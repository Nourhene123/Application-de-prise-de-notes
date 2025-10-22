export interface Note {
  uid: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  color: string;
  updatedAt: Date;
  userId: string;
}
