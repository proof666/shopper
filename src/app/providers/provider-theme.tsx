import React, { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../themes/theme.js";
import { ThemeContext } from "../../shared/hooks/hook-use-theme.js";

export interface ProviderThemeProps {
  children: ReactNode;
}

export const ProviderTheme: React.FC<ProviderThemeProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = useCallback(() => {
    setIsDark(!isDark);
  }, [isDark]);

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
