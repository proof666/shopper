import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthContext } from "../../shared/hooks/hook-use-auth-context.js";
import { PageAuth } from "../../pages/auth/page-auth.js";
import { PageProfile } from "../../pages/profile/page-profile.js";
import { PageLists } from "../../pages/lists/page-lists.js";
import { PageList } from "../../pages/list/page-list.js";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export const RouterApp: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<PageAuth />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lists"
          element={
            <ProtectedRoute>
              <PageLists />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list/:id"
          element={
            <ProtectedRoute>
              <PageList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PageLists />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};
