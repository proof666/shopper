import { useState, useEffect } from "react";
import {
  collection,
  query,
  // where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase.js";
import type { ListItem } from "../types/item.js";

export const useItems = (listId: string | null) => {
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listId) {
      setItems([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      const q = query(
        collection(db, "lists", listId, "items"),
        orderBy("createdAt", "asc")
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const itemsData = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              listId: data.listId,
              name: data.name,
              category: data.category,
              emoji: data.emoji,
              quantity: data.quantity,
              note: data.note,
              completed: data.completed || false,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            } as ListItem;
          });

          setItems(itemsData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          setError(`Firebase Error (${err.code}): ${err.message}`);
          setItems([]);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch {
      setError("Failed to setup database query");
      setLoading(false);
      return () => {};
    }
  }, [listId]);

  const createItem = async (
    name: string,
    opts?: {
      quantity?: string;
      note?: string;
      category?: string;
      emoji?: string;
    }
  ) => {
    if (!listId) throw new Error("listId is required");

    const baseData: Record<string, unknown> = {
      listId,
      name,
      completed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const itemData = {
      ...baseData,
      ...(opts?.quantity ? { quantity: opts.quantity } : {}),
      ...(opts?.note ? { note: opts.note } : {}),
      ...(opts?.category ? { category: opts.category } : {}),
      ...(opts?.emoji ? { emoji: opts.emoji } : {}),
    };

    await addDoc(collection(db, "lists", listId, "items"), itemData);
  };

  const updateItem = async (
    itemId: string,
    updates: Partial<Pick<ListItem, "name" | "quantity" | "note" | "completed">>
  ) => {
    const cleanUpdates: Record<string, unknown> = {};

    if (updates.name !== undefined) cleanUpdates.name = updates.name;
    if (updates.quantity !== undefined)
      cleanUpdates.quantity = updates.quantity;
    if (updates.note !== undefined) cleanUpdates.note = updates.note;
    if (updates.completed !== undefined)
      cleanUpdates.completed = updates.completed;

    cleanUpdates.updatedAt = serverTimestamp();

    if (!listId) throw new Error("listId required");
    await updateDoc(
      doc(db, "lists", listId as string, "items", itemId),
      cleanUpdates
    );
  };

  const deleteItem = async (itemId: string) => {
    if (!listId) throw new Error("listId required");
    await deleteDoc(doc(db, "lists", listId as string, "items", itemId));
  };

  return {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
  };
};

export default useItems;
