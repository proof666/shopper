import { type FC, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Fab,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAuthContext } from "../../shared/hooks/hook-use-auth-context.js";
import { useLists } from "../../shared/api/hook-use-lists.js";
import { ListCard } from "../../shared/ui/list-card.js";
import { CreateListDialog } from "../../shared/ui/create-list-dialog.js";

export const PageLists: FC = () => {
  const { user, loading: authLoading } = useAuthContext();
  const {
    lists,
    loading: listsLoading,
    error,
    createList,
    updateList,
    deleteList,
  } = useLists(user?.id || null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const isLoading = authLoading || listsLoading;

  const handleCreateList = async (title: string, description?: string) => {
    if (!user?.id) {
      console.error("Cannot create list: user not authenticated");
      return;
    }
    console.log("Creating list for user:", user.id);
    try {
      await createList(title, description);
      console.log("List created successfully");
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
            fontWeight: 600,
          }}
        >
          My Shopping Lists
        </Typography>

        {/* Desktop/tablet button: hide on very small screens */}
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
            size="large"
          >
            New List
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {lists.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          You don't have any shopping lists yet. Create your first list to get
          started!
        </Alert>
      ) : (
        <Box
          sx={(theme) => ({
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: { xs: 2, sm: 3 },
            // add some bottom padding so last card isn't obscured by FAB
            paddingBottom: { xs: theme.spacing(10), sm: 0 },
          })}
        >
          {lists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              onUpdate={updateList}
              onDelete={deleteList}
            />
          ))}
        </Box>
      )}

      <CreateListDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreateList}
      />
      {/* Mobile FAB: shown only on xs screens for easier thumb access */}
      <Fab
        color="primary"
        aria-label="new-list"
        sx={{
          position: "fixed",
          right: 16,
          bottom: 16,
          display: { xs: "flex", sm: "none" },
        }}
        onClick={() => setCreateDialogOpen(true)}
      >
        <Add />
      </Fab>
    </Box>
  );
};
