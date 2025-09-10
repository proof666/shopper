import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  getDocs,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Invitation } from "../types/invitation";
import type { User } from "../types/user";
import { getDoc } from "firebase/firestore";

type EnrichedInvitation = Invitation & {
  inviterName?: string;
  inviteeName?: string;
  listTitle?: string;
};

export const useInvitations = (userId: string | null) => {
  const [incoming, setIncoming] = useState<EnrichedInvitation[]>([]);
  const [outgoing, setOutgoing] = useState<EnrichedInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIncoming([]);
      setOutgoing([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      const qIn = query(
        collection(db, "invitations"),
        where("toUserId", "==", userId)
      );
      const qOut = query(
        collection(db, "invitations"),
        where("fromUserId", "==", userId)
      );

      const unsubIn = onSnapshot(qIn, async (snap) => {
        const dataPromises = snap.docs.map(async (d) => {
          const raw = d.data() as unknown as Record<string, unknown>;
          const inv: Invitation = {
            id: d.id,
            listId: String(raw.listId),
            fromUserId: String(raw.fromUserId),
            toUserId: String(raw.toUserId),
            status:
              (raw.status as unknown as "pending" | "accepted" | "rejected") ||
              "pending",
            createdAt: raw.createdAt as unknown as Timestamp,
          };
          // enrich with inviter name and list title
          const fromUserDoc = await getDoc(doc(db, "users", inv.fromUserId));
          const listDoc = await getDoc(doc(db, "lists", inv.listId));
          const fromUserRaw = fromUserDoc.exists()
            ? (fromUserDoc.data() as Record<string, unknown>)
            : null;
          const listRaw = listDoc.exists()
            ? (listDoc.data() as Record<string, unknown>)
            : null;
          return {
            ...inv,
            inviterName: fromUserRaw ? String(fromUserRaw.name) : undefined,
            listTitle: listRaw ? String(listRaw.title) : undefined,
          } as Invitation & { inviterName?: string; listTitle?: string };
        });
        const data = await Promise.all(dataPromises);
        setIncoming(data as EnrichedInvitation[]);
      });

      const unsubOut = onSnapshot(qOut, async (snap) => {
        const dataPromises = snap.docs.map(async (d) => {
          const raw = d.data() as unknown as Record<string, unknown>;
          const inv: Invitation = {
            id: d.id,
            listId: String(raw.listId),
            fromUserId: String(raw.fromUserId),
            toUserId: String(raw.toUserId),
            status:
              (raw.status as unknown as "pending" | "accepted" | "rejected") ||
              "pending",
            createdAt: raw.createdAt as unknown as Timestamp,
          };
          const toUserDoc = await getDoc(doc(db, "users", inv.toUserId));
          const listDoc = await getDoc(doc(db, "lists", inv.listId));
          const toUserRaw = toUserDoc.exists()
            ? (toUserDoc.data() as Record<string, unknown>)
            : null;
          const listRaw = listDoc.exists()
            ? (listDoc.data() as Record<string, unknown>)
            : null;
          return {
            ...inv,
            inviteeName: toUserRaw ? String(toUserRaw.name) : undefined,
            listTitle: listRaw ? String(listRaw.title) : undefined,
          } as Invitation & { inviteeName?: string; listTitle?: string };
        });
        const data = await Promise.all(dataPromises);
        setOutgoing(data as EnrichedInvitation[]);
      });

      setLoading(false);
      setError(null);

      return () => {
        unsubIn();
        unsubOut();
      };
    } catch (err) {
      setError((err as Error)?.message || String(err));
      setLoading(false);
      return () => {};
    }
  }, [userId]);

  const createInvitation = async (
    listId: string,
    fromUserId: string,
    toUserId: string
  ) => {
    // prevent duplicate pending invitations for same list/toUser
    const dupQ = query(
      collection(db, "invitations"),
      where("listId", "==", listId),
      where("toUserId", "==", toUserId),
      where("status", "==", "pending")
    );
    const dupSnap = await getDocs(dupQ);
    if (!dupSnap.empty) {
      throw new Error("Pending invitation already exists");
    }

    const data = {
      listId,
      fromUserId,
      toUserId,
      status: "pending",
      createdAt: serverTimestamp(),
    } as const;
    await addDoc(collection(db, "invitations"), data);
  };

  const updateInvitationStatus = async (
    invitationId: string,
    status: "accepted" | "rejected"
  ) => {
    await updateDoc(doc(db, "invitations", invitationId), { status });
  };

  const deleteInvitation = async (invitationId: string) => {
    await deleteDoc(doc(db, "invitations", invitationId));
  };

  const findUserByEmail = async (email: string) => {
    const q = query(collection(db, "users"), where("email", "==", email));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docSnap = snap.docs[0];
    const raw = docSnap.data() as unknown as Record<string, unknown>;
    const user: User & { id: string } = {
      id: docSnap.id,
      email: String(raw.email),
      name: String(raw.name),
      photoURL: raw.photoURL as string | undefined,
    };
    return user;
  };

  return {
    incoming,
    outgoing,
    loading,
    error,
    createInvitation,
    updateInvitationStatus,
    deleteInvitation,
    findUserByEmail,
  };
};

export default useInvitations;
