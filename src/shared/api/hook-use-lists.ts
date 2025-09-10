import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase.js";
import type { List } from "../types/list.js";

export const useLists = (userId: string | null) => {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLists([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      const q = query(
        collection(db, "lists"),
        where("ownerId", "==", userId),
        orderBy("updatedAt", "desc")
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const listsData = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ownerId: data.ownerId,
              title: data.title,
              description: data.description,
              collaborators: data.collaborators || [],
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            } as List;
          });

          setLists(listsData);
          setLoading(false);
          setError(null);
        },
        (error) => {
          setError(`Firebase Error (${error.code}): ${error.message}`);
          setLists([]);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch {
      setError("Failed to setup database query");
      setLoading(false);
      return () => {};
    }
  }, [userId]);

  const createList = async (title: string, description?: string) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const baseData = {
      ownerId: userId,
      title,
      collaborators: [userId],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const listData =
      description && description.trim()
        ? { ...baseData, description: description.trim() }
        : baseData;

    await addDoc(collection(db, "lists"), listData);
  };

  const updateList = async (
    listId: string,
    updates: Partial<Pick<List, "title" | "description">>
  ) => {
    const cleanUpdates: Record<
      string,
      string | ReturnType<typeof serverTimestamp>
    > = {};

    if (updates.title !== undefined) cleanUpdates.title = updates.title;
    if (updates.description !== undefined)
      cleanUpdates.description = updates.description;

    cleanUpdates.updatedAt = serverTimestamp();

    await updateDoc(doc(db, "lists", listId), cleanUpdates);
  };

  const deleteList = async (listId: string) => {
    await deleteDoc(doc(db, "lists", listId));
  };

  return {
    lists,
    loading,
    error,
    createList,
    updateList,
    deleteList,
  };
};
