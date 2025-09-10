import type { FC } from "react";
import {
  Box,
  Checkbox,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
} from "@mui/material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { Add } from "@mui/icons-material";
// getCategoryColor is not needed here; color is passed via props

type Item = {
  id: string;
  name: string;
  completed: boolean;
  emoji?: string;
  category?: string;
  quantity?: string;
  note?: string;
};

type Props = {
  item: Item;
  translate: number;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  categoryColor: string;
};

const ItemRow: FC<Props> = ({
  item,
  translate,
  onToggle,
  onDelete,
  categoryColor,
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        pr: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          width: "100%",
          borderLeft: `4px solid ${categoryColor}`,
        }}
        style={{
          transform: `translateX(${translate}px)`,
          transition: translate ? "none" : "transform 180ms ease",
        }}
      >
        <Checkbox
          checked={item.completed}
          onChange={() => onToggle(item.id, item.completed)}
        />
        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {item.emoji ? <span>{item.emoji}</span> : null}
              <span
                style={{
                  textDecoration: item.completed ? "line-through" : "none",
                }}
              >
                {item.name}
              </span>
            </Box>
          }
          secondary={
            item.quantity ? `${item.quantity} · ${item.note || ""}` : item.note
          }
        />
      </Box>

      <ListItemSecondaryAction sx={{ mr: 1 }}>
        <IconButton
          className="delete-btn"
          sx={{ visibility: "hidden", transition: "opacity 120ms" }}
          edge="end"
          onClick={() => onDelete(item.id)}
          aria-label="delete"
        >
          <Add sx={{ transform: "rotate(45deg)" }} />
        </IconButton>
      </ListItemSecondaryAction>

      <Box
        sx={{
          position: "absolute",
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <DeleteOutline
          sx={(theme) => ({
            color: theme.palette.error.main,
            opacity: Math.min(1, Math.abs(translate) / 80),
            transition: "opacity 120ms",
          })}
        />
      </Box>
    </Box>
  );
};

export default ItemRow;
