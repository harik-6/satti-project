import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

export default function ThinkerLoader({ text="Thinking..." }) {
  return (
    <div className="flex flex-row gap-4">
      <CircularProgress color="primary" size={20} />
      <div className="text-sm font-semibold text-gray-700">{text}</div>
    </div>
  );
} 