"use client";
import React, { useState } from "react";
import Stepper from "../../components/stepper/Stepper";
import UploadPage from "../../components/upload/Upload";
import Markup from "../../components/markup/Markup";
import AllocationWidget from "../../components/allocation/Allocation";
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


function AnalyzingWidget({ response }) {
  return (
    <div className="flex flex-col h-full items-center">
      {
        response ? (
          <Markup sx={{
            fontSize: '1.2rem',
            maxHeight: '600px',
            overflowY: 'auto',
            maxWidth: '60%',
            lineHeight: '1.5',
            padding: '1.1rem'
          }}
            content={response}
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
  const [behaviour, setBehaviour] = useState(null);
  const [allocation, setAllocation] = useState(null);

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
      console.log(result);
      setTransactions(result.transactions);
    } catch (err) {
      console.log(`file upload error: ${err.message}`);
    }
  };

  const classifyBehaviour = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/classify/behaviour", {
        method: "POST",
        body: JSON.stringify({
          "status": "success",
          "transactions": transactions,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setBehaviour(result);
    } catch (err) {
      console.log(`classify behaviour error: ${err.message}`);
    }
  }

  const startOver = () => {
    setCurrentStep(0);
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
      startOver();
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
          <AnalyzingWidget response={behaviour?.behaviour}  />
          <AllocationWidget behaviour={behaviour} onAllocation={setAllocation} />
          <AssetRecommendationPage
            onStartOver={startOver}
            onInvest={investNow}
            allocation={allocation}
          />
        </Stepper>
      </div>
    </div>
  );
} 