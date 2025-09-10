import React, { useCallback } from "react";
import {
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Avatar,
  Switch,
} from "@mui/material";
import { signOut } from "firebase/auth";
import { auth, db } from "../../shared/api/firebase.js";
import { useAuth } from "../../shared/api/hook-use-auth";
import { useInvitations } from "../../shared/api/hook-use-invitations";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { Snackbar, Alert } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useThemeSettings } from "../../app/providers/provider-theme.js";

export const PageProfile: React.FC = () => {
  const { mode, color, toggleMode, setColor, preset } = useThemeSettings();
  const { user } = useAuth();
  const {
    incoming,
    outgoing,
    loading,
    updateInvitationStatus,
    deleteInvitation,
  } = useInvitations(user?.id || null);
  const [snack, setSnack] = React.useState<{
    open: boolean;
    message: string;
    severity?: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const handleLogout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const handleToggleTheme = useCallback(() => {
    toggleMode();
  }, [toggleMode]);

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
      setSnack({
        open: true,
        message: "Invitation deleted",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Failed to delete", severity: "error" });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", textAlign: "center", py: 4 }}>
      <Avatar src={user?.photoURL} sx={{ width: 96, height: 96, mx: "auto" }} />
      <Typography variant="h5" sx={{ mt: 2 }}>
        {user?.name}
      </Typography>
      <Typography color="text.secondary">{user?.email}</Typography>

      <Box
        sx={{
          mt: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography>Dark theme</Typography>
        <Switch checked={mode === "dark"} onChange={handleToggleTheme} />
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography>Primary color</Typography>
        <Box
          sx={{
            mt: 1,
            display: "inline-flex",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {preset.map((c) => (
            <Box
              key={c}
              onClick={() => setColor(c)}
              sx={{
                width: 40,
                height: 40,
                bgcolor: c,
                borderRadius: "50%",
                boxShadow:
                  color === c ? "0 0 0 4px rgba(0,0,0,0.12)" : undefined,
                cursor: "pointer",
              }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 4, textAlign: "left" }}>
        <Typography variant="h6">Invitations</Typography>
        {loading && <Typography>Loading...</Typography>}
        <List>
          {/** combine incoming and outgoing into a single list with direction */}
          {(
            [
              ...incoming.map(
                (i) => ({ ...i, direction: "incoming" } as const)
              ),
              ...outgoing.map(
                (o) => ({ ...o, direction: "outgoing" } as const)
              ),
            ] as const
          )
            .flat()
            .sort(
              (a, b) =>
                (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
            )
            .map((inv) => (
              <ListItem
                key={inv.id}
                secondaryAction={
                  <Box>
                    {inv.direction === "incoming" &&
                      inv.status === "pending" && (
                        <>
                          <Button
                            onClick={() => handleAccept(inv.id, inv.listId)}
                          >
                            Accept
                          </Button>
                          <Button onClick={() => handleReject(inv.id)}>
                            Reject
                          </Button>
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
                  secondary={`${
                    inv.direction === "incoming"
                      ? "From: " + (inv.inviterName ?? inv.fromUserId)
                      : "To: " + (inv.inviteeName ?? inv.toUserId)
                  } — Status: ${inv.status}`}
                />
              </ListItem>
            ))}
        </List>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Sign out
        </Button>
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
