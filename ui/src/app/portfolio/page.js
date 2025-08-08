"use client";
import React, { useState, useEffect } from "react";
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
  Collapse,
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PortfolioPage() {
  const [tab, setTab] = useState("mutual");
  const [portfolio, setPortfolio] = useState([]);
  const [expandedFund, setExpandedFund] = useState(null);
  const searchParams = useSearchParams();
  const flowId = searchParams.get("flow_id");

  async function getPortfolio() {
    const response = await fetch(`http://127.0.0.1:8000/portfolio?flow_id=${flowId}`, {
      method: "POST",
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

  const toggleGraph = (fundCode) => {
    setExpandedFund(expandedFund === fundCode ? null : fundCode);
  };

  const createChartData = (fundData) => {
    const sortedData = [...fundData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const labels = sortedData.map(item => item.date);
    const navData = sortedData.map(item => parseFloat(item.nav));
    
    return {
      labels: labels,
      datasets: [
        {
          label: 'NAV',
          data: navData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
          pointRadius: 0, // Remove dots
          pointHoverRadius: 0, // Remove dots on hover
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      title: {
        display: false, // Hide title
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Remove vertical grid lines
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          display: false, // Remove horizontal grid lines
        },
      },
    },
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
              {portfolio.map((fund) => (
                <React.Fragment key={fund["scheme_code"]}>
                  <TableRow>
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
                        onClick={() => toggleGraph(fund["scheme_code"])}
                        size="small"
                      >
                        {expandedFund === fund["scheme_code"] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {expandedFund === fund["scheme_code"] && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Collapse in={expandedFund === fund["scheme_code"]} timeout="auto" unmountOnExit>
                          <div style={{ padding: '20px', height: '400px' }}>
                            <Line data={createChartData(fund["data"])} options={chartOptions} />
                          </div>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </div>
  );
} 