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
  Tabs,
  Tab,
  Box,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';

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
    setPortfolio(result.payload);
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
    <div className="max-w-5xl mx-auto p-6">
      <Box sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={handleTabChange} aria-label="portfolio tabs">
          <Tab label="Mutual Funds" value="mutual" />
          <Tab label="Stock" value="stock" />
        </Tabs>
      </Box>
      
      {tab === "stock" ? (
        <div className="text-gray-500 text-center py-20">Stock portfolio coming soon...</div>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow>
                  {
                  ["Fund Name", "NAV"].map((header) => (
                    <TableCell key={header} sx={{ fontWeight: 'bold' }}>{header}</TableCell>
                  ))
                  }
              </TableRow>
            </TableHead>
            <TableBody>
              {
                portfolio.map((fund) => (
                  <TableRow key={fund["nav"]}>
                    <TableCell>{fund["scheme_name"]}</TableCell>
                    <TableCell>{fund["nav"]}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => openGraph(fund)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))  
              }
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
} 