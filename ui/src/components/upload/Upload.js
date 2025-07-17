"use client";
import React, { useRef, useState } from "react";

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
    <div>
      <form
        onSubmit={() => {}}
      >
        <div className="font-semibold text-lg text-gray-700 mb-2 text-center">
          Select your file to upload
        </div>
        <button
          type="button"
          onClick={handleBrowseClick}
          className="bg-blue-600 cursor-pointer text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors duration-200 mb-2 mx-auto block"
        >
          Browse files
        </button>
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