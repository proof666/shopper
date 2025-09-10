import { Timestamp } from "firebase/firestore";

export interface ListItem {
  id: string;
  listId: string;
  name: string;
  quantity?: string;
  category?: string;
  emoji?: string;
  note?: string;
  completed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
