import { type FC } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/hook-use-auth-context.js";

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case "/":
    case "/lists":
      return "Shopping Lists";
    case "/profile":
      return "Profile";
    default:
      if (pathname.startsWith("/list/")) {
        return "Shopping List";
      }
      return "Shopper";
  }
};

export const Header: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const pageTitle = getPageTitle(location.pathname);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Left: app title */}
        <Box sx={{ display: "flex", alignItems: "center", minWidth: 0, mr: 1 }}>
          <Typography
            variant="h6"
            component="div"
            onClick={handleHomeClick}
            sx={{
              cursor: "pointer",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: 600,
            }}
          >
            Shopper
          </Typography>
        </Box>

        {/* Center: page title */}
        <Box sx={{ flexGrow: 1, textAlign: "center", minWidth: 0 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem" },
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {pageTitle}
          </Typography>
        </Box>

        {/* Right: avatar */}
        <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
          <IconButton
            onClick={handleProfileClick}
            sx={{ p: 0 }}
            aria-label="profile"
          >
            <Avatar
              src={user?.photoURL}
              alt={user?.name}
              sx={{ width: 40, height: 40 }}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
