import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";
import type { User } from "../types/user.js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  console.log({ user });

  useEffect(() => {
    console.log("useAuth: 🔄 Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            name: firebaseUser.displayName!,
            photoURL: firebaseUser.photoURL || undefined,
          });
          console.log("useAuth: ✅ User set successfully:", firebaseUser.uid);
        } else {
          console.log("useAuth: ❌ No user authenticated");
          setUser(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("useAuth: ❌ Auth state change error:", error);
        setUser(null);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return { user, loading };
};
