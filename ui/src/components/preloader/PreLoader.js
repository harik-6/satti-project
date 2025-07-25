import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

export default function PreLoader({ text="Analyzing file" }) {
  return (
    <div className="flex flex-col gap-4 justify-center items-center py-50">
      <CircularProgress color="primary" size={60} />
      <div className="text-sm font-semibold text-gray-700">{text}</div>
    </div>
  );
} 