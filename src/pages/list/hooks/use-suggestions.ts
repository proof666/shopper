import { useMemo } from "react";
import type { Suggestion as BaseSuggestion } from "../components/suggestions";
import type { ListItem } from "../../../shared/types/item";
import itemsJson from "../../../shared/items.json";

export type Suggestion = BaseSuggestion;

export function useSuggestions(
  items: Array<ListItem> | undefined,
  input: string
) {
  // load suggestions from items.json
  const suggestionsList: Suggestion[] = useMemo(
    () => itemsJson as Suggestion[],
    []
  );

  const typed = input.trim();

  const filteredByCategory = useMemo(() => {
    if (!typed) return new Map<string, Suggestion[]>();
    const prefix = typed.toLowerCase();

    const dedupe = new Map<string, Suggestion>();

    // prefer existing items metadata
    (items || []).forEach((it) => {
      if (it.name && it.name.toLowerCase().startsWith(prefix)) {
        dedupe.set(it.name.toLowerCase(), {
          name: it.name,
          category: it.category || "Other",
          emoji: it.emoji,
        });
      }
    });

    suggestionsList.forEach((s) => {
      if (
        s.name.toLowerCase().startsWith(prefix) &&
        !dedupe.has(s.name.toLowerCase())
      ) {
        dedupe.set(s.name.toLowerCase(), s);
      }
    });

    const map = new Map<string, Suggestion[]>();
    dedupe.forEach((s) => {
      const cat = s.category || "Other";
      const arr = map.get(cat) || [];
      arr.push(s);
      map.set(cat, arr);
    });

    for (const [cat, arr] of map.entries()) {
      arr.sort((a, b) => a.name.localeCompare(b.name));
      map.set(cat, arr);
    }

    return map;
  }, [items, suggestionsList, typed]);

  const categories = useMemo(() => {
    const map = new Map<string, string | undefined>();
    (suggestionsList || []).forEach((s) => {
      if (!map.has(s.category)) map.set(s.category || "Other", s.emoji);
    });
    return map;
  }, [suggestionsList]);

  return { typed, filteredByCategory, categories } as const;
}
