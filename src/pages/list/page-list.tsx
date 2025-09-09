import React, { type FC } from "react";
import { useParams } from "react-router-dom";

export const PageList: FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>List {id}</h1>
      {/* TODO: List items */}
    </div>
  );
};
