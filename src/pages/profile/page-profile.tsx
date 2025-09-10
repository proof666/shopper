import React, { useCallback } from "react";
import {
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { signOut } from "firebase/auth";
import { auth, db } from "../../shared/api/firebase.js";
import { useTheme } from "../../shared/hooks/hook-use-theme.js";
import { useAuth } from "../../shared/api/hook-use-auth";
import { useInvitations } from "../../shared/api/hook-use-invitations";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { Snackbar, Alert } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export const PageProfile: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { incoming, outgoing, loading, updateInvitationStatus, deleteInvitation } = useInvitations(
    user?.id || null
  );
  const [snack, setSnack] = React.useState<{
    open: boolean;
    message: string;
    severity?: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const handleLogout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const handleToggleTheme = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const handleAccept = async (invId: string, listId: string) => {
    // add this user to list collaborators
    if (!user) return;
    try {
      await updateDoc(doc(db, "lists", listId), {
        collaborators: arrayUnion(user.id),
      });
      await updateInvitationStatus(invId, "accepted");
      setSnack({
        open: true,
        message: "Invitation accepted",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (invId: string) => {
    try {
      await updateInvitationStatus(invId, "rejected");
      setSnack({
        open: true,
        message: "Invitation rejected",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (invId: string) => {
    try {
      await deleteInvitation(invId);
      setSnack({ open: true, message: "Invitation deleted", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Failed to delete", severity: "error" });
    }
  };

  return (
    <Box>
      <Typography variant="h4">Profile</Typography>
      <Typography>Welcome to your profile!</Typography>
      <Button onClick={handleToggleTheme}>
        Switch to {isDark ? "Light" : "Dark"} Theme
      </Button>
      <Button onClick={handleLogout}>Logout</Button>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Incoming invitations</Typography>
        {loading && <Typography>Loading...</Typography>}
        <List>
          {incoming.map((inv) => (
            <ListItem
              key={inv.id}
              secondaryAction={
                <Box>
                  {inv.status === 'pending' && (
                    <>
                      <Button onClick={() => handleAccept(inv.id, inv.listId)}>
                        Accept
                      </Button>
                      <Button onClick={() => handleReject(inv.id)}>Reject</Button>
                    </>
                  )}
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(inv.id)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={`${inv.listTitle ?? inv.listId}`}
                secondary={`From: ${inv.inviterName ?? inv.fromUserId} — Status: ${inv.status}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Outgoing invitations</Typography>
        {loading && <Typography>Loading...</Typography>}
        <List>
          {/** render outgoing invites */}
          {/** assume current user is the sender for outgoing list */}
          {outgoing.map((inv) => (
            <ListItem
              key={inv.id}
              secondaryAction={
                <Box>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(inv.id)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={`${inv.listTitle ?? inv.listId}`}
                secondary={`To: ${inv.inviteeName ?? inv.toUserId} — Status: ${inv.status}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snack.severity} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
