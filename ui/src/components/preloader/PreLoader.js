import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

export default function PreLoader({ size=60, text="Analyzing file" }) {
  return (
    <div className="flex flex-row gap-4">
      <CircularProgress color="primary" size={size} />
      <div className="text-sm font-semibold text-gray-700">{text}</div>
    </div>
  );
} 