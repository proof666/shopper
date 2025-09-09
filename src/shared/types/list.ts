import { Timestamp } from "firebase/firestore";

export interface List {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  collaborators: string[];
}
