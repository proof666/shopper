import { Timestamp } from "firebase/firestore";

export interface Invitation {
  id: string;
  listId: string;
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Timestamp;
}
