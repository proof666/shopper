import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PageAuth } from "../../pages/auth/page-auth.js";
import { PageProfile } from "../../pages/profile/page-profile.js";
import { PageLists } from "../../pages/lists/page-lists.js";
import { PageList } from "../../pages/list/page-list.js";

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<PageAuth />} />
        <Route path="/profile" element={<PageProfile />} />
        <Route path="/lists" element={<PageLists />} />
        <Route path="/list/:id" element={<PageList />} />
        <Route path="/" element={<PageLists />} />
      </Routes>
    </Router>
  );
};
