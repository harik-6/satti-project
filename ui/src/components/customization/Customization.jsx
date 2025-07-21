import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";

export default function CustomizationWidget() {
  const investmentTypes = [
    "Mutual Funds",
    "Gold",
    "Fixed Deposit",
    "Stocks"
  ];
  const [selected, setSelected] = useState(["Mutual Funds"]);
  const [insightChecked, setInsightChecked] = useState(true);
  const [allocations, setAllocations] = useState({ risky: 50, safe: 50 });

  const handleAllocationChange = (type, value) => {
    let val = Math.round(Math.max(0, Math.min(100, Number(value))));
    let otherType = type === 'risky' ? 'safe' : 'risky';
    let otherVal = 100 - val;
    setAllocations({ [type]: val, [otherType]: otherVal });
  };

  const toggleType = (type) => {
    setSelected((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="flex flex-col items-start justify-start h-full w-full max-w-2xl mx-auto">
      <h4 className="text-lg font-semibold">Asset Type</h4>
      <div className="flex flex-wrap gap-3 justify-start mt-4 mb-8 w-full">
        {investmentTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => toggleType(type)}
            className={`px-3 py-1.5 rounded-full border font-medium text-sm shadow transition-colors duration-200 focus:outline-none flex items-center gap-1.5
              ${selected.includes(type)
                ? "border-2 bg-white text-blue-600 border-blue-600"
                : "border bg-white text-gray-700 border-gray-300 hover:bg-blue-50"}
            `}
          >
            {selected.includes(type) && <CheckIcon fontSize="small" className="mr-1" />}
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}