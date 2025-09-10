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

  console.log(user.photoURL);

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          onClick={handleHomeClick}
          sx={{
            flexGrow: 0,
            mr: 2,
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          Shopper
        </Typography>

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, textAlign: "center" }}
        >
          {pageTitle}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
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
