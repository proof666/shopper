import { type FC, useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputAdornment,
  Divider,
} from "@mui/material";
import { Add, Share } from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import getCategoryColor from "../../shared/category-colors";
import Suggestions, { type Suggestion } from "./components/suggestions";
import ItemRow from "./components/item-row";

import { useSuggestions } from "./hooks/use-suggestions";
import { useSwipe } from "./hooks/use-swipe";
import useFlip from "./hooks/use-flip";
import { useParams } from "react-router-dom";
import { useItems } from "../../shared/api/hook-use-items";
import { useAuth } from "../../shared/api/hook-use-auth";
import { useInvitations } from "../../shared/api/hook-use-invitations";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../shared/api/firebase";

export const PageList: FC = () => {
  const { id } = useParams();
  const listId = id || null;
  const { items, loading, error, createItem, updateItem, deleteItem } =
    useItems(listId);
  const { user } = useAuth();
  const { findUserByEmail, createInvitation } = useInvitations(
    user?.id || null
  );

  const [input, setInput] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity?: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const [listTitle, setListTitle] = useState<string | null>(null);

  const { typed, filteredByCategory, categories } = useSuggestions(
    items,
    input
  );
  const { setRef: flipSetRef } = useFlip(items || []);

  useEffect(() => {
    if (typed) setOverlayOpen(true);
    else setOverlayOpen(false);
  }, [typed]);

  // click-outside and Escape handling
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!overlayOpen) return;
      const el = containerRef.current;
      if (!el) return;
      if (!(e.target instanceof Node)) return;
      if (!el.contains(e.target)) setOverlayOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOverlayOpen(false);
    };

    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [overlayOpen]);

  const handleAdd = async () => {
    if (!input.trim() || !listId) return;
    await createItem(input.trim());
    setInput("");
  };

  const addSuggestion = async (sugg: Suggestion) => {
    if (!sugg?.name || !listId) return;
    await createItem(sugg.name, { category: sugg.category, emoji: sugg.emoji });
    setInput("");
    setOverlayOpen(false);
  };

  const addByCategory = async (category: string) => {
    if (!listId) return;
    const name = input.trim();
    const emoji = categories.get(category) || undefined;
    await createItem(name || "", { category, emoji });
    setInput("");
    setOverlayOpen(false);
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    await updateItem(id, { completed: !completed });
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
  };

  // initialize swipe handlers (depends on handleDelete)
  const { swipeTranslate, bindTouchHandlers } = useSwipe(handleDelete);

  // subscribe to the parent list doc to get its title
  useEffect(() => {
    if (!listId) {
      setListTitle(null);
      return;
    }
    const docRef = doc(db, "lists", listId);
    const unsub = onSnapshot(docRef, (snap) => {
      const data = snap.data();
      setListTitle(data?.title || null);
    });
    return unsub;
  }, [listId]);

  // group items by category, split by completed state
  const uncompleted = new Map<string, typeof items>();
  const completed = new Map<string, typeof items>();
  (items || []).forEach((item) => {
    const cat = item.category || "Other";
    const target = item.completed ? completed : uncompleted;
    const arr = target.get(cat) || [];
    arr.push(item);
    target.set(cat, arr);
  });

  const renderGroup = (map: Map<string, typeof items>) =>
    [...map.keys()].sort().map((cat) => (
      <Box key={cat} sx={{ mb: 1 }}>
        {(map.get(cat) || []).map((it) => (
          <div
            key={it.id}
            {...bindTouchHandlers(it.id)}
            style={{ display: "block" }}
            ref={flipSetRef(it.id)}
          >
            <ItemRow
              item={it}
              translate={swipeTranslate[it.id] || 0}
              onToggle={toggleComplete}
              onDelete={handleDelete}
              categoryColor={getCategoryColor(cat)}
            />
          </div>
        ))}
      </Box>
    ));

  return (
    <Box sx={{ p: { xs: 1 } }}>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
        <Typography variant="h5" sx={{ flex: "0 0 auto" }}>
          {listTitle ?? "List"}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <IconButton aria-label="share" onClick={() => setShareOpen(true)}>
          <Share />
        </IconButton>
      </Box>

      <Box sx={{ position: "relative", mb: 2 }} ref={containerRef}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            // variant="standard"
            placeholder="Add product"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      color="primary"
                      onClick={handleAdd}
                      aria-label="add"
                    >
                      <Add />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </Box>

      {/* List area wrapped so overlay can sit on top of it */}
      <Box sx={{ position: "relative" }}>
        <Suggestions
          open={overlayOpen}
          filteredByCategory={filteredByCategory}
          categories={categories}
          onAddSuggestion={addSuggestion}
          onAddByCategory={addByCategory}
        />

        <List>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          {error && <Typography color="error">{error}</Typography>}

          {!loading && (
            <>
              {renderGroup(uncompleted)}
              {completed.size > 0 && <Divider sx={{ my: 2 }} />}
              {renderGroup(completed)}
            </>
          )}
        </List>
        {/* close the relative wrapper */}
      </Box>

      <Dialog open={shareOpen} onClose={() => setShareOpen(false)}>
        <DialogTitle>Share list</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Email"
            fullWidth
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareOpen(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              if (!user) return;
              if (!listId) return;
              // ensure current user is owner of the list
              // simple check: fetch list doc ownerId
              try {
                const target = await findUserByEmail(shareEmail.trim());
                if (!target) {
                  setSnack({
                    open: true,
                    message: "No user with that email",
                    severity: "error",
                  });
                  setShareOpen(false);
                  return;
                }
                // create invitation document
                await createInvitation(listId, user.id, target.id);
                setSnack({
                  open: true,
                  message: `Invitation sent to ${target.email}`,
                  severity: "success",
                });
              } catch (err) {
                const message =
                  (err as Error)?.message || "Failed to send invitation";
                setSnack({ open: true, message, severity: "error" });
                console.error("Failed to send invitation", err);
              }
              setShareOpen(false);
            }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
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
