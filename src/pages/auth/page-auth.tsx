import React, { useCallback, type FC } from "react";
import { Button } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../shared/api/firebase.js";

export const PageAuth: FC = () => {
  const handleLogin = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login error:", error);
    }
  }, []);

  return (
    <div>
      <h1>Login</h1>
      <Button variant="contained" onClick={handleLogin}>
        Sign in with Google
      </Button>
    </div>
  );
};
