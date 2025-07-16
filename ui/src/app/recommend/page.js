"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Markup from "../../components/markup/Markup";
import PreLoader from "../../components/preloader/PreLoader";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ReplayIcon from "@mui/icons-material/Replay";

export default function AssetRecommendationPage() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [recommendation, setRecommendation] = useState(null);
    const [actionDiv, setActionDiv] = useState(false);
    const [error, setError] = useState(null);
    const behaviourRef = useRef(null);

    function showActionDiv() {
        setActionDiv(true);
    }

    async function getPortfolio(spendBehaviour) {
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
            // console.error(error);
            setError(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        const spendBehaviour = searchParams.get("behaviour");
        if (behaviourRef.current !== spendBehaviour) {
            getPortfolio(spendBehaviour);
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center min-h-screen pt-16">
            <div className="w-full max-w-2xl flex flex-col gap-4 items-end">
                <p className="inline-block bg-gray-100 rounded-lg px-4 py-2 text-right">
                    Based on your spending behaviour, I recommend the following funds to be invested
                </p>
                <div className="w-full text-left">
                    {
                        loading ? (
                            <div className="mt-8"> <PreLoader size={20} text="Thinking..." /> </div>
                        ) : (
                            error ? (
                                <div className="mt-8 text-center text-red-500">
                                    <p>Something went wrong. Please try again.</p>
                                    <button className="bg-blue-500 text-white px-2 py-1 rounded-md mt-8 gap-1" onClick={() => getPortfolio(searchParams.get("behaviour"))}>
                                        <span>Try again</span>
                                        <ReplayIcon fontSize="small" />
                                    </button>
                                </div>
                            ) : (
                                <Markup content={recommendation} onComplete={() => showActionDiv()} />
                            )
                        )
                    }
                </div>
            </div>
            {
                actionDiv && (
                    <div className=" max-w-2xl flex flex-row gap-4">
                        <button className="border border-blue-500 text-blue-500 bg-transparent px-2 py-1 rounded-md">
                            <p>Start over</p>
                        </button>
                        <button className="bg-blue-500 text-white px-2 py-1 rounded-md">
                            <p>Invest now <ArrowForwardIcon fontSize="small" /></p>
                        </button>
                    </div>
                )
            }
        </div>
    );
} 