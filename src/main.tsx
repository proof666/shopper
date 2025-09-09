import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ProviderTheme } from "./app/providers/provider-theme.js";
import { ProviderAuth } from "./app/providers/provider-auth.js";
import { RouterApp } from "./app/router/router-app.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProviderTheme>
      <ProviderAuth>
        <RouterApp />
      </ProviderAuth>
    </ProviderTheme>
  </StrictMode>
);
