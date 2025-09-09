import React, { type FC } from "react";
import { Link } from "react-router-dom";

export const PageLists: FC = () => {
  return (
    <div>
      <h1>Shopping Lists</h1>
      <Link to="/profile">Profile</Link>
      {/* TODO: List of lists */}
    </div>
  );
};
