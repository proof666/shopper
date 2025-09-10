import { type FC, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
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
        <Typography variant="h4" component="h1">
          My Shopping Lists
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
          size="large"
        >
          New List
        </Button>
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
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
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
    </Box>
  );
};
