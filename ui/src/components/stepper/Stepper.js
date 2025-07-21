import React from "react";
import StepperMui from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


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
    <div className="w-full">
      <StepperMui activeStep={currentStep} alternativeLabel className="mb-10">
        {labels.map((label) => (
          <Step key={label}>
            <StepLabel >{label}</StepLabel>
          </Step>
        ))}
      </StepperMui>
      <div className="min-h-[650px]">{children[currentStep]}</div>
      <div className="flex justify-between mt-2">
        <Button
          variant="outlined"
          color="primary"
          onClick={handleBack}
          disabled={currentStep === 0}
          startIcon={<ArrowBackIcon fontSize="small" />}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          endIcon={<ArrowForwardIcon fontSize="small" />}
        >
          {currentStep === labels.length - 1 ? (
            <span className="flex items-center gap-2">Show me the plan</span>
          ) : (
            "Next"
          )}
        </Button>
      </div>
    </div>
  );
} 