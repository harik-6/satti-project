"use client";
import React, { useState } from "react";
import Stepper from "../../components/stepper/Stepper";
import UploadPage from "../../components/upload/Upload";
import CircularProgress from "@mui/material/CircularProgress";
import Markup from "../../components/markup/Markup";
import CustomizationWidget from "../../components/customization/Customization";


function AnalyzingWidget({ assistantReponse }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {
        assistantReponse ? (
          <>
          <Markup content={assistantReponse} />
          </>
        ) : (
          <>
            <CircularProgress color="primary" size={60} />
            <div className="mt-6 text-lg font-semibold text-gray-700">Analyzing file</div>
          </>
        )
      }
    </div>
  );
}

export default function StartPage() {
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
        console.log("result", result);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Stepper labels={labels} currentStep={currentStep} onStepChange={setCurrentStep}>
        <UploadPage onUpload={handleUpload} />
        <AnalyzingWidget assistantReponse={assistantReponse} />
        <CustomizationWidget />
      </Stepper>
    </div>
  );
} 