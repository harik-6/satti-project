"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@mui/material";
import Markup from "../markup/Markup";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ReplayIcon from "@mui/icons-material/Replay";
import ThinkerLoader from "../thinkerloader/ThinkerLoader";

const textSize = '1.1rem';
const lineHeight = '1.5';

export default function AssetRecommendationPage({ allocation, onStartOver,  onInvest  }) {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [actionDiv, setActionDiv] = useState(false);
  const [error, setError] = useState(false);

  function showActionDiv() {
    setActionDiv(true);
  }

  async function getFundSuggestions() {
    console.log(allocation);
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        body: JSON.stringify(allocation),
        headers: {
          "Content-Type": "application/json",
        }
      });
      const result = await response.json();
      setRecommendation(result);
      setLoading(false);
    } catch (error) {
      console.error(`recommendation error: ${error.message}`);
      setError(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    if(allocation != null) {
      getFundSuggestions();
      setActionDiv(false);
    }
  }, [allocation]);

  return (
    <div className="flex flex-col items-center min-h-screen pt-16 overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col gap-4 items-end">
        <p style={{
          fontSize: textSize,
          lineHeight: lineHeight
        }} className="inline-block bg-gray-100 rounded-lg px-4 py-2 text-right">
          Based on your spending behaviour, I recommend the following funds to be invested
        </p>
        <div className="w-full text-left">
          {
            loading ? (
              <div className="mt-8"> <ThinkerLoader /> </div>
            ) : (
              error ? (
                <div className="mt-8 text-center text-red-500">
                  <p>Something went wrong. Please try again.</p>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    className="mt-8 gap-1" 
                    onClick={() => getPortfolio(searchParams.get("behaviour"))}
                    startIcon={<ReplayIcon />}
                  >
                    Try again
                  </Button>
                </div>
              ) : (
                <Markup sx={{
                  overflowY: 'auto',
                  fontSize: textSize,
                  lineHeight: lineHeight,
                  padding: '1.1rem'
                }} content={recommendation?.recommendation} onComplete={() => showActionDiv()} />
              )
            )
          }
        </div>
      </div>
      {
        actionDiv && (
          <div className="mt-8 max-w-2xl flex flex-row gap-4">
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={onStartOver}
            >
              Start over
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={onInvest}
              endIcon={<ArrowForwardIcon />}
            >
              Simulate Investment
            </Button>
          </div>
        )
      }
    </div>
  );
} 