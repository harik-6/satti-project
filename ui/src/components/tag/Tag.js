"use client"
import React, { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PreLoader from "../preloader/PreLoader";

export default function Tag({transactions = [], onUpdate}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeCategory = async (e, id) => {
    const category = e.target.value;
    console.log(id,category);
    const newTx = transactions.map((tx,idx) => idx === id ? { ...tx, category } : tx);
    console.log(newTx);
    onUpdate(newTx);
  }

  const categoryOptions = [
    'rent', 'food', 'shopping', 'groceries', 'movies', 
    'entertainment', 'essential', 'health', 
    'transport', 'trips', 'bank',
    'investment', 'insurance', 'education', 'stocks','income','utility','untagged'
  ];

  const headers = ["Id","Date", "Narration","Amount", "Category"];

  function renderAmount(row) {
    if (row.debit && Number(row.debit) !== 0) {
      return <span style={{ color: 'red' }}>{row.debit}</span>;
    } else if (row.credit && Number(row.credit) !== 0) {
      return <span style={{ color: 'green' }}>{row.credit}</span>;
    } else {
      return <span>N/A</span>;
    }
  }

  if(transactions.length === 0) {
    return <PreLoader text="Tagging all your transactions..." />;
  }


  return (
      <div className="bg-white rounded-sm p-4 max-w-10xl w-full mx-4">
        <TableContainer className="overflow-x-auto">
          <Table stickyHeader>
            <TableHead >
              <TableRow>
                {headers.map((header, idx) => (
                  <TableCell sx={{ fontWeight: 'bold',fontSize: '1.1rem' }} key={idx}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.narration}</TableCell>
                  <TableCell>{renderAmount(row)}</TableCell>
                  <TableCell>
                    <Select
                      value={row.category || ''}
                      size="small"
                      displayEmpty
                      sx={{ minWidth: 120 }}
                      onChange={(e) => handleChangeCategory(e, Number(page * rowsPerPage + idx))}
                    >
                      {categoryOptions.map((option,idx) => (
                        <MenuItem key={option + "-" + idx} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={transactions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[7, 10, 25, 50]}
        />
      </div>
  );
} 