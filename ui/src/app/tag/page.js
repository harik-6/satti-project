"use client"
import React, { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';

export default function Tag() {
  const [tags, setTags] = useState([]);

  const fetchTags = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/tag", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setTags(result.payload);
    } catch (err) {
      // setError(`Upload error: ${err.message}`);
    }
  }

  useEffect(() => {
    fetchTags()
  }, []);

  return (
    <div className="flex justify-center items-start pt-4">
      <div className="bg-white rounded-sm shadow p-4 max-w-10xl w-full mx-4">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Narration</TableCell>
                <TableCell>Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tags.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{row.narration}</TableCell>
                  <TableCell>
                    <Chip label={row.category} color="primary" variant="outlined" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
} 