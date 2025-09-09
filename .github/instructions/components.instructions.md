## Key Conventions

### Component Structure

```tsx
// Page components in src/pages/[feature]/page-[name].tsx
export const PageName = () => {
  // Business logic hooks
  const { data, loading } = useFirebaseHook();

  // UI rendering
  return <Component />;
};
```

### Firebase Integration

```tsx
// Custom hooks in src/shared/api/firebase/
export const useItems = (userId: UserId | null) => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!userId) return;
    const q = query(collection, orderBy("field"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    });
    return unsub;
  }, [userId]);

  return { items, loading };
};
```

### Type Definitions

```tsx
// src/shared/types/index.ts
export interface Item {
  id: string;
  userId: string;
  title: string;
  position: number; // For custom ordering
  // ... other fields
}
```

### MUI Usage

- Use MUI components with theme integration
- Prefer `sx` prop for custom styling
- Follow responsive design patterns (`xs`, `sm`, `md` breakpoints)

## Development Workflow

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run typecheck` - TypeScript validation
- Firebase rules in `firestore.rules`

## Common Patterns

- **Data fetching**: Firebase hooks with real-time updates
- **Error handling**: Try-catch in async functions
- **Loading states**: `loading` boolean from hooks
- **Navigation**: `useNavigate` from React Router
- **Forms**: Controlled components with `useState`

## File Organization

- Keep components focused and single-responsibility
- Extract reusable logic to custom hooks
- Use absolute imports with `../../../shared/`
- Group related files in feature directories

## File Requirements

- The file name should start with the FSD type (such as `page`, `widget`, `feature`, `entity`, `shared`), followed by the component name.

## Component Structure

1. For components with props: declare props interface separately, named `<ComponentName>Props`, and exported.
2. For components without props: use `FC` from React without props interface.
3. The component should be exported as `export const <ComponentName> = (props) => { ... }` or `export const <ComponentName>: FC = () => { ... }`.
4. Do not use default exports.
5. Do not use re-exports or `index` files.

## Example

### File name

`page-profile.tsx`

### Component with props

```tsx
import React, { FC } from "react";

export interface PageProfileProps {
  userId: string;
}

export const PageProfile: FC<PageProfileProps> = ({ userId }) => {
  return <div>User ID: {userId}</div>;
};
```

### Component without props

```tsx
import React, { FC } from "react";

export const PageLists: FC = () => {
  return <div>Shopping Lists</div>;
};
```

When importing from .ts or .tsx files, always specify the .js extension.

All callbacks passed to components must be declared separately and use useCallback.
