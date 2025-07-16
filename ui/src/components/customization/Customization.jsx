import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";

export default function CustomizationWidget() {
  const investmentTypes = [
    "Mutual Funds",
    "Gold",
    "Fixed Deposit",
    "Government Bonds",
    "Corporate Bonds",
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
      {/* <h4 className="text-lg font-semibold">Asset Allocation</h4>
      <div className="flex gap-8 justify-start items-start mb-6 w-full">
        <div className="flex flex-col items-start">
          <label htmlFor="risky-input" className="font-medium text-gray-700 mb-1">Risky Assets</label>
          <div className="flex items-center gap-1">
            <input
              id="risky-input"
              type="number"
              min={0}
              max={100}
              value={allocations.risky}
              onChange={e => handleAllocationChange('risky', e.target.value)}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:border-blue-500"
            />
            <span className="text-gray-500">%</span>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="safe-input" className="font-medium text-gray-700 mb-1">Safe Assets</label>
          <div className="flex items-center gap-1">
            <input
              id="safe-input"
              type="number"
              min={0}
              max={100}
              value={allocations.safe}
              onChange={e => handleAllocationChange('safe', e.target.value)}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:border-blue-500"
            />
            <span className="text-gray-500">%</span>
          </div>
        </div>
      </div> */}
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
      {/* <div className="flex items-center justify-start mt-4 w-full">
        <input
          type="checkbox"
          id="insight-checkbox"
          checked={insightChecked}
          onChange={() => setInsightChecked((prev) => !prev)}
          className="w-5 h-5 accent-blue-600 mr-2"
        />
        <label htmlFor="insight-checkbox" className="text-gray-700 text-base select-none cursor-pointer">
          Give me insights on how can I reduce my unwanted spending
        </label>
      </div> */}
    </div>
  );
}