"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function PortfolioPage() {
  const [tab, setTab] = useState("mutual");
  const [portfolio, setPortfolio] = useState([]);
  const searchParams = useSearchParams();

  async function getPortfolio() {
    const response = await fetch("http://127.0.0.1:8000/portfolio", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const result = await response.json();
    console.log("portfolio", result);
    setPortfolio(result.portfolio);
  }

  useEffect(() => {
    getPortfolio();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const openGraph = (fund) => {
    setSelectedFund(fund);
  };

  // Function to format numbers to Indian rupee denomination
  const formatIndianRupee = (amount) => {
    if (!amount) return '0.00';
    
    const num = parseFloat(amount);
    if (isNaN(num)) return '0.00';
    
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)}Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)}L`;
    } else if (num >= 1000) {
      return `₹${(num / 1000).toFixed(2)}K`;
    } else {
      return `₹${num.toFixed(2)}`;
    }
  };

  function formatProfitLoss(value) {
    value = Number(value).toFixed(2);
    if (value && Number(value) < 0) {
      return <span style={{ color: 'red' }}>-{value}%</span>;
    } else if (value && Number(value) > 0) {
      return <span style={{ color: 'green' }}>+{value}%</span>;
    } else {
      return <span>N/A</span>;
    }
  }


  return (
    <div className="max-w-8xl mx-auto p-6 px-10">
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow>
                  {
                  ["Fund Name","Fund House", "NAV" , "Invested", "Current" , "P/L" ,""].map((header) => (
                    <TableCell key={header} sx={{ fontWeight: 'bold' }}>{header}</TableCell>
                  ))
                  }
              </TableRow>
            </TableHead>
            <TableBody>
              {
                portfolio.map((fund) => (
                  <TableRow key={fund["scheme_code"]}>
                    <TableCell>
                      <p className="font-semibold">{fund["scheme_name"]}</p>
                      <p className="text-xs text-gray-500 py-1">{fund["scheme_category"]}</p>
                    </TableCell>
                    <TableCell>{fund["fund_house"]}</TableCell>
                    <TableCell>{Number(fund["data"][0]["nav"]).toFixed(2)}</TableCell>
                    <TableCell>{formatIndianRupee(fund["total_invested_value"])}</TableCell>
                    <TableCell>{formatIndianRupee(fund["total_current_value"])}</TableCell>
                    <TableCell>{formatProfitLoss(fund["profit_loss_perc"])}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => openGraph(fund)}
                        size="small"
                      >
                        <KeyboardArrowDownIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))  
              }
            </TableBody>
          </Table>
        </TableContainer>
    </div>
  );
} 