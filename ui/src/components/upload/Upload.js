"use client";
import React, { useRef, useState } from "react";
import Button from '@mui/material/Button';
import UploadIcon from '@mui/icons-material/Upload';

export default function UploadPage({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.name.endsWith(".txt")) {
      setError("Please select a TXT file.");
      setSelectedFile(null);
    } else if (file) {
      setError("");
      onUpload(file);
    }
  };

  const handleBrowseClick = () => {
    inputRef.current.click();
  };

  return (
    <div style={{
      height: '500px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <form
        onSubmit={() => {}}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <div className="font-semibold text-xl text-gray-700 mb-4">
          Select your file to upload
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBrowseClick}
          startIcon={<UploadIcon />}
          sx={{ 
            mx: 'auto',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          Browse files
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".txt"
          className="hidden"
          onChange={handleFileChange}
        />
        {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
        {selectedFile && (
          <div className="mt-4 text-center text-gray-700">
            <strong>Selected file:</strong> {selectedFile.name}
          </div>
        )}
      </form>
    </div>
  );
} 