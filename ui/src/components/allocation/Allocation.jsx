import { useEffect,useState } from "react";
import Markup from "../../components/markup/Markup";
import PreLoader from "@/components/preloader/PreLoader";
import PieChart from "./PieChart";

let FLOW_ID = "";

export default function AllocationWidget({ flowId }) {

  const [allocation, setAllocation] = useState(null);
  const [goldPerc, setGoldPerc] = useState(0);
  const [equityPerc, setEquityPerc] = useState(0);



  const fetchAllocation = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/allocate?flow_id=${flowId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      // allocation_perc "Gold=70,Equity=30"
      const allocation_perc = result.allocation_perc.split(",");
      const allocation_perc_obj = {};
      allocation_perc.forEach(item => {
        const [key, value] = item.split("=");
        allocation_perc_obj[key] = parseInt(value);
      });
      result.allocation_perc = allocation_perc_obj;
      setGoldPerc(allocation_perc_obj.Gold);
      setEquityPerc(allocation_perc_obj.Equity);
      setAllocation(result);
    } catch (err) {
      console.error(`allocation error: ${err.message}`);
    }
  }

  useEffect(() => {
    if (FLOW_ID != flowId) {
      FLOW_ID = flowId;
      fetchAllocation();
    }
  }, [flowId]);

  if (allocation == null || allocation.allocation_text == null) {
    return <PreLoader />;
  }

  return (
    <div className="flex flex-col h-full items-center">
      <PieChart gold_perc={goldPerc} equity_perc={equityPerc} />
      <Markup sx={{
        fontSize: '1.2rem',
        maxHeight: '600px',
        overflowY: 'auto',
        maxWidth: '60%',
        lineHeight: '1.5'
      }}
        content={allocation.allocation_text}
        />
    </div>
  );
} 