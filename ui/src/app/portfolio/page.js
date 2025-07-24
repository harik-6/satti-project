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
                    <TableCell>{0}</TableCell>
                    <TableCell>{0}</TableCell>
                    <TableCell>{0}</TableCell>
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