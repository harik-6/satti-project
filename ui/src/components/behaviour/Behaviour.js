import { useState, useEffect } from "react";
import PreLoader from "../preloader/PreLoader";
import Markup from "../markup/Markup";

let FLOW_ID = null;

export default function Behaviour({ flowId }) {
  const [behaviour, setBehaviour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBehaviour = async () => {
      const response = await fetch(`http://127.0.0.1:8000/behaviour?flow_id=${flowId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setBehaviour(result.behaviour);
      setLoading(false);
    }
    if (FLOW_ID !== flowId) {
      FLOW_ID = flowId;
      fetchBehaviour();
    }
  }, [flowId]);

  return (
    <div className="flex flex-col h-full items-center">
      {
        !loading ? (
          <Markup sx={{
            fontSize: '1.2rem',
            maxHeight: '600px',
            overflowY: 'auto',
            maxWidth: '60%',
            lineHeight: '1.5',
            padding: '1.1rem'
          }}
            content={behaviour}
          />
        ) : (
          <PreLoader />
        )
      }
    </div>
  );
}