import { type FC, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Box,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { Edit, Delete, Check, Close, MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { List } from "../types/list.js";

interface ListCardProps {
  list: List;
  onUpdate: (
    listId: string,
    updates: Partial<Pick<List, "title" | "description">>
  ) => Promise<void>;
  onDelete: (listId: string) => Promise<void>;
}

export const ListCard: FC<ListCardProps> = ({ list, onUpdate, onDelete }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  const [editDescription, setEditDescription] = useState(
    list.description || ""
  );

  const handleSave = async () => {
    await onUpdate(list.id, {
      title: editTitle,
      description: editDescription || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(list.title);
    setEditDescription(list.description || "");
    setIsEditing(false);
  };

  const handleCardClick = () => {
    if (!isEditing) {
      navigate(`/list/${list.id}`);
    }
  };

  // Menu state for overflow actions
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const openMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const closeMenu = () => setAnchorEl(null);

  // MUI Menu onClose signature -> wrapper to stop propagation if possible
  const handleMenuClose = (event: unknown) => {
    // Try to stop propagation for events that support it (menu backdrop clicks might not)
    const ev = event as { stopPropagation?: () => void } | undefined;
    ev?.stopPropagation?.();
    closeMenu();
  };

  return (
    <Card
      sx={{
        cursor: isEditing ? "default" : "pointer",
        "&:hover": {
          boxShadow: isEditing ? 1 : 3,
        },
        transition: "box-shadow 0.2s",
      }}
      onClick={handleCardClick}
    >
      <CardContent
        sx={{
          padding: { xs: 2.5, sm: 2 },
          "&:last-child": { paddingBottom: 2.5 },
        }}
      >
        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              label="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              sx={{ mb: 2 }}
              onClick={(e) => e.stopPropagation()}
            />
            <TextField
              fullWidth
              label="Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              multiline
              rows={2}
              sx={{ mb: 2 }}
              onClick={(e) => e.stopPropagation()}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                startIcon={<Check />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
              >
                Save
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Close />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ fontSize: { xs: "1.05rem", sm: "1.15rem" } }}
            >
              {list.title}
            </Typography>
            {list.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {list.description}
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {list.createdAt?.toDate?.()?.toLocaleDateString()}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  aria-label="more"
                  aria-controls={menuOpen ? `menu-${list.id}` : undefined}
                  aria-haspopup="true"
                  onClick={openMenu}
                  size="large"
                >
                  <MoreVert />
                </IconButton>
                <Menu
                  id={`menu-${list.id}`}
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleMenuClose}
                  onClick={(e) => e.stopPropagation()}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                >
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      closeMenu();
                      setIsEditing(true);
                    }}
                  >
                    <Edit sx={{ mr: 1 }} /> Edit
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      closeMenu();
                      onDelete(list.id);
                    }}
                  >
                    <Delete sx={{ mr: 1 }} /> Delete
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
