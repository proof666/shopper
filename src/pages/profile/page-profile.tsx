import React, { useCallback } from "react";
import { Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../../shared/api/firebase.js";
import { useTheme } from "../../shared/hooks/hook-use-theme.js";

export const PageProfile: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const handleToggleTheme = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome to your profile!</p>
      <Button onClick={handleToggleTheme}>
        Switch to {isDark ? "Light" : "Dark"} Theme
      </Button>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};
