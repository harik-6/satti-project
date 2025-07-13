"use client";
import React, { useState } from "react";

const CARD_OPTIONS = [
  { label: "Conservative" },
  { label: "Moderate" },
  { label: "Spender" },
];

export default function SpenderPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex gap-8">
        {CARD_OPTIONS.map((option, idx) => (
          <button
            key={option.label}
            onClick={() => setSelected(idx)}
            className={`min-w-[240px] min-h-[200px] bg-white rounded-xl shadow-xl flex items-center justify-center text-[26px] font-semibold text-gray-700 cursor-pointer transition-all duration-200 outline-none border-4 ${selected === idx ? 'border-purple-600' : 'border-gray-200'}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <button
        className="mt-12 bg-purple-600 text-white rounded-lg px-12 py-4 font-semibold text-xl shadow-lg cursor-pointer transition-colors duration-200 hover:bg-purple-700"
      >
        Proceed
      </button>
    </div>
  );
} 