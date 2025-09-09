---
applyTo: "**"
---

📋 **Technical Specification: Web Application for Shared Shopping Lists**

### 1. General Idea

The application allows users to create shopping lists, manage items within them, and share lists with other registered users. Shared lists are collaboratively editable and visible to all accepted participants.

---

### 2. Target Audience

- Primary use: personal and family shopping lists.
- Multi-user support: users can share lists with each other.

---

### 3. Core Features

**Users**

- Sign-in via Firebase Authentication (Google OAuth).
- Profile page (name, email from Google profile, theme switch).

**Lists**

- View a list of all user’s shopping lists.
- Create a new list (title, description optional).
- Edit and delete lists.
- Share list:

  - User enters another user’s email.
  - If a user with that email exists → a "share invitation" record is created in Firestore.
  - The invited user sees a notification/invitation in their profile.
  - Once accepted, the list becomes visible and editable by both users.

- Shared access: all collaborators can add/remove/edit items.

**List Items**

- Add item (name, quantity, optional note).
- Mark item as completed (checkbox).
- Edit and delete item.

---

### 4. Interface (Pages)

- **Authentication page** – Google login.
- **Profile page** – user info, theme switch, incoming/outgoing share invitations.
- **Lists page** – all shopping lists (owned + shared).
- **List page** – view items, add/edit/delete items, mark as completed.

UI must be responsive (mobile-friendly).
The app must be a PWA (offline mode, installable on mobile).

---

### 5. Technologies

- **Language**: TypeScript (strict typing for all data, models, props, and API responses).
- **Frontend**: React (with Vite).
- **UI library**: @mui/material.
- **Icons**: @mui/icons-material.
- **Styling**: plain CSS or CSS modules (no Tailwind or other CSS frameworks).
- **Charts**: not required for this project.
- **PWA**: Vite PWA plugin.
- **Firebase**: Firestore + Authentication (Google OAuth).

**Constraints**

- Use the minimum number of third-party packages — only essential ones (@mui/material, Firebase SDK).
- All Firebase calls (auth, firestore) must be moved into a separate layer (hooks + services) and isolated from business logic and components.
- Project architecture must follow **Feature-Sliced Design (FSD)**:

  - **app** – app configuration (router, providers, themes).
  - **pages** – pages (profile, lists, list, auth).
  - **widgets** – large UI blocks (navigation, list preview, list items).
  - **features** – functional modules (auth, add-list, share-list, add-item, etc.).
  - **entities** – entities (user, list, item, invitation).
  - **shared** – utilities, hooks, types, UI components.

---

### 6. Data Model (Firestore)

**Users**

```ts
User {
  id: string;         // UID from Firebase Auth
  email: string;
  name: string;
  photoURL?: string;
}
```

**Lists**

```ts
List {
  id: string;
  ownerId: string;          // user who created
  title: string;
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  collaborators: string[];  // user IDs with access
}
```

**List Items**

```ts
ListItem {
  id: string;
  listId: string;
  name: string;
  quantity?: string;
  note?: string;
  completed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Share Invitations**

```ts
Invitation {
  id: string;
  listId: string;
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Timestamp;
}
```

---

### 7. Security Rules (Firebase Firestore)

- A user can read/write lists where:

  - `ownerId == request.auth.uid` OR
  - `request.auth.uid` is in `collaborators`.

- A user can read/write items only in lists they have access to.
- A user can create invitations only if they are the list owner.
- Only the invited user can accept/reject an invitation.

---

### 8. Non-Functional Requirements

- Strict typing for all data (User, List, Item, Invitation).
- No direct Firebase calls in UI components.
- Hooks like `useLists`, `useItems`, `useInvitations` must be isolated in `shared/api/firebase`.
- Dark/light theme support via MUI theme provider.

---

### 9. User Story

“As a user, I want to log in with Google, create a shopping list, add items to it, and share this list with my wife by entering her email. She should receive an invitation, accept it, and then both of us can see and edit the list together.”

---
