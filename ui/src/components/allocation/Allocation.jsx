import { useEffect,useState } from "react";
import Markup from "../../components/markup/Markup";
import PreLoader from "@/components/preloader/PreLoader";
import PieChart from "./PieChart";

let type = "";

export default function AllocationWidget({ behaviour, onAllocation }) {

  const [allocation, setAllocation] = useState(null);


  const fetchAllocation = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/allocate", {
        method: "POST",
        body: JSON.stringify(behaviour),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setAllocation(result);
      onAllocation(result);
    } catch (err) {
      console.error(`allocation error: ${err.message}`);
    }
  }

  useEffect(() => {
    if (behaviour["behaviour_short"] != type) {
      type = behaviour["behaviour_short"];
      fetchAllocation(behaviour);
    }
  }, [behaviour["behaviour_short"]]);

  if (allocation == null || allocation.allocation_text == null) {
    return <PreLoader />;
  }

  return (
    <div className="flex flex-col h-full items-center">
      <PieChart gold_perc={allocation["allocation_perc"]["gold"]} equity_perc={allocation["allocation_perc"]["mf_perc"]} />
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