"use client";
import React, { useState } from "react";
import Stepper from "../../components/stepper/Stepper";
import UploadPage from "../../components/upload/Upload";
import Markup from "../../components/markup/Markup";
import CustomizationWidget from "../../components/customization/Customization";
import PreLoader from "../../components/preloader/PreLoader";
import TagWidget from "../../components/tag/page";
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
  const [transactions, setTransactions] = useState([]);
  const [assistantReponse, setAssistantReponse] = useState(null);
  const [error, setError] = useState("");

  const handleUpload = async (file) => {
    setCurrentStep(1);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setTransactions(result.payload);
    } catch (err) {
      setError(`Upload error: ${err.message}`);
    }
  };

  

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
  };

  const handleBack = (newStep) => {
    if (newStep === 0) {
      setAssistantReponse(null);
    }
  };

  return (
    <div className="flex justify-center items-start pt-4 h-full">
      <div className="bg-white rounded-sm shadow p-10 max-w-10xl w-full mx-4">
        <Stepper
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onNext={handleNext}
          onBack={handleBack}
        >
          <UploadPage onUpload={handleUpload} />
          <TagWidget 
          transactions={transactions} 
          onUpdate={setTransactions}
          />
          <AnalyzingWidget assistantReponse={assistantReponse} />
          <CustomizationWidget />
        </Stepper>
      </div>
    </div>
  );
} 