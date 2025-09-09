import React from "react";
import type { ReactNode } from "react";
import { useAuth } from "../../shared/api/hook-use-auth.js";
import { AuthContext } from "../../shared/hooks/hook-use-auth-context.js";

export interface ProviderAuthProps {
  children: ReactNode;
}

export const ProviderAuth: React.FC<ProviderAuthProps> = ({ children }) => {
  const { user, loading } = useAuth();

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
