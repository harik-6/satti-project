import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Stepper({ labels, currentStep, onStepChange, children, onNext, onBack }) {

  const handleNext = () => {
    if (currentStep < labels.length - 1) {
      onStepChange(currentStep + 1);
    }
    onNext(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
    onBack(currentStep - 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        {labels.map((label, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center">
              <div
                className={`rounded-full w-10 h-10 flex items-center justify-center font-bold border-2 transition-colors duration-200
                  ${idx === currentStep
                    ? "bg-blue-600 text-white border-blue-600"
                    : idx < currentStep
                    ? "bg-blue-100 text-blue-700 border-blue-400"
                    : "bg-gray-200 text-gray-400 border-gray-300"}
                `}
              >
                {idx + 1}
              </div>
              <span className={`mt-3 text-base font-medium ${idx === currentStep ? "text-blue-700" : "text-gray-700"}`}>
                {label}
              </span>
            </div>
            {idx < labels.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 transition-colors duration-200
                  ${idx < currentStep
                    ? "bg-blue-600"
                    : "bg-gray-300"}
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow p-10 min-h-[600px]">
        {children[currentStep]}
      </div>
      <div className="flex justify-between mt-10">
        <button
          className="px-8 py-3 cursor-pointer rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </button>
        <button
          className="px-8 py-3 cursor-pointer rounded bg-blue-600 text-white font-semibold disabled:opacity-50"
          onClick={handleNext}
        >
          {currentStep === labels.length - 1 ? (
            <span className="flex items-center gap-2">Show me the plan <ArrowForwardIcon fontSize="small" /></span>
          ) : (
            "Next"
          )}
        </button>
      </div>
    </div>
  );
} 