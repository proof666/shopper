const BASE_COLORS = [
  "#4caf50", // green
  "#2196f3", // blue
  "#ff9800", // orange
  "#9c27b0", // purple
  "#f44336", // red
  "#00bcd4", // cyan
  "#8bc34a", // light green
  "#ff5722", // deep orange
  "#607d8b", // blue grey
  "#3f51b5", // indigo
];

const KNOWN: Record<string, string> = {
  Хлебобулочные: "#ffb74d",
  "Молочные продукты": "#ffd54f",
  "Мясо и птица": "#ef9a9a",
  Колбасы: "#ff8a65",
  Овощи: "#66bb6a",
  Фрукты: "#ffa726",
  "Рыба и морепродукты": "#4fc3f7",
  Напитки: "#4dd0e1",
  Кондитерские: "#f48fb1",
};

export function getCategoryColor(category: string): string {
  if (!category) return "#9e9e9e";
  if (KNOWN[category]) return KNOWN[category];
  // deterministic fallback by hashing category name
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash << 5) - hash + category.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % BASE_COLORS.length;
  return BASE_COLORS[idx] ?? "#9e9e9e";
}

export default getCategoryColor;
