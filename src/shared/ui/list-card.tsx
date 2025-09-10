import { type FC, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Box,
  Button,
} from "@mui/material";
import { Edit, Delete, Check, Close } from "@mui/icons-material";
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
      <CardContent>
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
            <Typography variant="h6" component="h2" gutterBottom>
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
              <Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(list.id);
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
