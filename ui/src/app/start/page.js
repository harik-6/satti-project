"use client";
import React, { useState } from "react";
import Stepper from "../../components/stepper/Stepper";
import UploadPage from "../../components/upload/Upload";
import Markup from "../../components/markup/Markup";
import CustomizationWidget from "../../components/customization/Customization";
import PreLoader from "../../components/preloader/PreLoader";
import { useRouter } from "next/navigation";


function AnalyzingWidget({ assistantReponse }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {
        assistantReponse ? (
          <>
            <Markup content={assistantReponse} />
          </>
        ) : (
          <PreLoader />
        )
      }
    </div>
  );
}

export default function StartPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [assistantReponse, setAssistantReponse] = useState(null);
  const [error, setError] = useState("");

  const handleUpload = async (file) => {
    setCurrentStep(1);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://127.0.0.1:8000/classify/behaviour", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        setError(`Upload failed: ${errorText}`);
      } else {
        const result = await response.json();
        setAssistantReponse(result["assistant_response"]);
      }
    } catch (err) {
      setError(`Upload error: ${err.message}`);
    }
  };

  const labels = [
    "Upload",
    "Analyze",
    "Customization"
  ];

  const handleNext = async (newStep) => {
    if (newStep === 3) {
      try {
        const response = await fetch("http://127.0.0.1:8000/classify/behaviour/short", {
          method: "POST",
          body: JSON.stringify({
            "behaviour": assistantReponse,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        router.push(`/recommend?behaviour=${result.payload}`);
      } catch (err) {
        setError(`Upload error: ${err.message}`);
      }

      return;
    }
    console.log("handleNext", newStep);
  };

  const handleBack = (newStep) => {
    if (newStep === 0) {
      setAssistantReponse(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Stepper
        labels={labels}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onNext={handleNext}
        onBack={handleBack}
      >
        <UploadPage onUpload={handleUpload} />
        <AnalyzingWidget assistantReponse={assistantReponse} />
        <CustomizationWidget />
      </Stepper>
    </div>
  );
} 