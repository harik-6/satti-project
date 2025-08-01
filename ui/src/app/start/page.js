"use client";
import React, { useState } from "react";
import Stepper from "../../components/stepper/Stepper";
import UploadPage from "../../components/upload/Upload";
import AllocationWidget from "../../components/allocation/Allocation";
import TagWidget from "../../components/tag/Tag";
import BehaviourWidget from "../../components/behaviour/Behaviour";
import AssetRecommendationPage from "../../components/recommend/Recommendation";
import { useRouter } from "next/navigation";

const labels = [
  "Upload Statement",
  "Transaction Tagging",
  "Behaviour Analysis",
  "Portfolio Allocation",
  "Portfolio Recommendation"
];



export default function StartPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [flowId, setFlowId] = useState(null);

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
      setFlowId(result.flow_id);
    } catch (err) {
      console.log(`file upload error: ${err.message}`);
    }
  };

  const startOver = () => {
    setCurrentStep(0);
    setBehaviour(null);
    setFlowId(null);
  }

  const investNow = () => {
    router.replace(`/portfolio?flow_id=${flowId}`);
  }

  const handleNext = async (newStep) => {
    setCurrentStep(newStep);
  };

  const handleBack = (newStep) => {
    if (newStep === 0) {
      startOver();
    }
    setCurrentStep(newStep);
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
            flowId={flowId} 
          />
          <BehaviourWidget flowId={flowId}  />
          <AllocationWidget flowId={flowId} />
          <AssetRecommendationPage
            flowId={flowId}
            onStartOver={startOver}
            onInvest={investNow}
          />
        </Stepper>
      </div>
    </div>
  );
} 