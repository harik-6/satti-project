"use client";
import React, { useRef, useState } from "react";
import Markup from "../../components/markup/Markup";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [assistant_response, setAssistantReponse] = useState(null);
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = [
      "application/pdf",
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];
    const allowedExtensions = [".pdf", ".csv", ".xlsx"];
    if (
      file &&
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    ) {
      setError("Please select a PDF, CSV, or XLSX file.");
      setSelectedFile(null);
    } else if (file) {
      setError("");
      setSelectedFile(file);
    }
  };

  const handleBrowseClick = () => {
    inputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("No file selected.");
      return;
    }
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await fetch("http://127.0.0.1:8000/classify/behaviour", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`Upload failed: ${errorText}`);
      } else {
        const result = await response.json();
        setAssistantReponse(result["assistant_response"]);
        // console.log(`Upload successful! Response: ${JSON.stringify(result)}`);
      }
    } catch (err) {
      console.log(`Upload error: ${err.message}`);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#fff" }}>
      <Markup content={assistant_response} />
      <form
        onSubmit={handleSubmit}
        style={{ width: 400, maxWidth: "90vw", background: "#fff", border: "2px dashed #d1d5db", borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", padding: 40, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", transition: "border-color 0.2s", borderColor: "#d1d5db" }}
      >
        <button
          type="button"
          onClick={handleBrowseClick}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors duration-200 mb-2 mx-auto block"
        >
          Browse files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {error && <div style={{ color: "red", marginTop: 8, textAlign: "center" }}>{error}</div>}
        {selectedFile && (
          <div style={{ marginTop: 16, textAlign: "center", color: "#444" }}>
            <strong>Selected file:</strong> {selectedFile.name}
          </div>
        )}
      </form>
      <button
        type="submit"
        form=""
        className="mt-8 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors duration-200 mx-auto block disabled:opacity-50"
        onClick={handleSubmit}
        disabled={!selectedFile}
      >
        Proceed
      </button>
    </div>
  );
} 