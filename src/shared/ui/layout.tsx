import { type FC, type ReactNode } from "react";
import { Box } from "@mui/material";
import { Header } from "./header.js";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box sx={{ flex: 1, p: 3 }}>{children}</Box>
    </Box>
  );
};
