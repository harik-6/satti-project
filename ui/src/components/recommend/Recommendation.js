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

export default function AssetRecommendationPage({ behaviour, onStartOver,  onInvest  }) {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [actionDiv, setActionDiv] = useState(false);
  const [error, setError] = useState(null);

  function showActionDiv() {
    setActionDiv(true);
  }

  async function getFundSuggestions(spendBehaviour) {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/select/funds", {
        method: "POST",
        body: JSON.stringify({
          "behaviour": spendBehaviour,
        }),
        headers: {
          "Content-Type": "application/json",
        }
      });
      const result = await response.json();
      setRecommendation(result.payload);
      setError(null);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (behaviour === null) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    } else {
      getFundSuggestions(behaviour);
      setActionDiv(false);
    }

  }, [behaviour]);

  return (
    <div className="flex flex-col items-center min-h-screen pt-16">
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
                  lineHeight: lineHeight
                }} content={recommendation} onComplete={() => showActionDiv()} />
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