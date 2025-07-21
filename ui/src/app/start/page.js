"use client";
import React, { useState } from "react";
import Stepper from "../../components/stepper/Stepper";
import UploadPage from "../../components/upload/Upload";
import Markup from "../../components/markup/Markup";
import CustomizationWidget from "../../components/customization/Customization";
import TagWidget from "../../components/tag/Tag";
import PreLoader from "@/components/preloader/PreLoader";
import AssetRecommendationPage from "../../components/recommend/Recommendation";

const labels = [
  "Upload",
  "Tag",
  "Analyze",
  "Portfolio Allocation",
  "Recommendation"
];


function AnalyzingWidget({ assistantReponse }) {
  return (
    <div className="flex flex-col h-full items-center">
      {
        assistantReponse ? (
          <Markup sx={{
            fontSize: '1.2rem',
            maxHeight: '600px',
            overflowY: 'auto',
            maxWidth: '60%',
            lineHeight: '1.5'
          }}
            content={assistantReponse}
          />
        ) : (
          <PreLoader />
        )
      }
    </div>
  );
}

export default function StartPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [assistantReponse, setAssistantReponse] = useState(null);
  const [behaviour, setBehaviour] = useState(null);
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
      setError(`file upload error: ${err.message}`);
    }
  };

  const classifyBehaviour = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/classify/behaviour", {
        method: "POST",
        body: JSON.stringify({
          "status": "success",
          "payload": transactions,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setAssistantReponse(result.behaviour);
      setBehaviour(result.behaviour_short);
      console.log(result);
    } catch (err) {
      setError(`classify behaviour error: ${err.message}`);
    }
  }

  const startOver = () => {
    setCurrentStep(0);
    setAssistantReponse(null);
    setBehaviour(null);
  }

  const investNow = () => {
    router.replace(`/portfolio`);
  }

  const handleNext = async (newStep) => {
    if (newStep === 2) {
      classifyBehaviour();
      return;
    }
  };

  const handleBack = (newStep) => {
    if (newStep === 0) {
      setAssistantReponse(null);
    }
  };

  return (
    <div className="flex justify-center items-start pt-0 h-full">
      <div className="bg-white p-10 max-w-10xl w-full mx-0">
        <Stepper
          labels={labels}
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
          <AssetRecommendationPage
            onStartOver={startOver}
            onInvest={investNow}
            behaviour={behaviour}
          />
        </Stepper>
      </div>
    </div>
  );
} 