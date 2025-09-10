import type { FC } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import getCategoryColor from "../../../shared/category-colors";

export type Suggestion = { name: string; category: string; emoji?: string };

type Props = {
  open: boolean;
  filteredByCategory: Map<string, Suggestion[]>;
  categories: Map<string, string | undefined>;
  onAddSuggestion: (s: Suggestion) => void;
  onAddByCategory: (cat: string) => void;
};

const Suggestions: FC<Props> = ({
  open,
  filteredByCategory,
  categories,
  onAddSuggestion,
  onAddByCategory,
}) => {
  if (!open) return null;

  if (filteredByCategory.size > 0) {
    return (
      <Box
        sx={(theme) => ({
          position: "absolute",
          top: 8,
          zIndex: 20,
          backgroundColor: alpha(theme.palette.background.default, 0.93),
          color: theme.palette.text.primary,
          overflow: "visible",
        })}
      >
        {[...filteredByCategory.entries()].map(([cat, arr]) => (
          <Box key={cat} sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: (t) => t.palette.text.secondary,
                fontWeight: 600,
                mb: 1,
              }}
            >
              {cat}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {arr.map((s) => (
                <Chip
                  key={s.name}
                  label={
                    <span
                      style={{
                        display: "inline-flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      {s.emoji ? (
                        <span style={{ marginRight: 6 }}>{s.emoji}</span>
                      ) : null}
                      {s.name}
                    </span>
                  }
                  onClick={() => onAddSuggestion(s)}
                  sx={{
                    backgroundColor: getCategoryColor(s.category),
                    color: "#fff",
                    px: 1.5,
                    py: 0.5,
                    fontSize: "0.95rem",
                    borderRadius: 2,
                    boxShadow: `0 1px 4px ${alpha("#000", 0.18)}`,
                  }}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={(theme) => ({
        position: "absolute",
        top: 8,
        zIndex: 20,
        backgroundColor: alpha(theme.palette.background.default, 0.92),
        color: theme.palette.text.primary,
        overflow: "visible",
      })}
    >
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, color: (t) => t.palette.text.secondary }}
      >
        Categories
      </Typography>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {[...categories.entries()].map(([cat, emoji]) => (
          <Chip
            key={cat}
            label={
              <span
                style={{ display: "inline-flex", gap: 8, alignItems: "center" }}
              >
                {emoji ? <span style={{ marginRight: 6 }}>{emoji}</span> : null}
                {cat}
              </span>
            }
            onClick={() => onAddByCategory(cat)}
            sx={{
              backgroundColor: getCategoryColor(cat),
              color: "#fff",
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Suggestions;
