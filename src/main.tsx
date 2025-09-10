import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeModeProvider } from "./app/providers/provider-theme.js";
import { ProviderAuth } from "./app/providers/provider-auth.js";
import { RouterApp } from "./app/router/router-app.js";
import { CssBaseline } from "@mui/material";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeModeProvider>
      <ProviderAuth>
        <CssBaseline />
        <RouterApp />
      </ProviderAuth>
    </ThemeModeProvider>
  </StrictMode>
);
