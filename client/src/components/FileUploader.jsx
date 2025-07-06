import React, { useState } from "react";
import { parseCSV } from "../utils/csvParser";
import { parseExcel } from "../utils/excelParser";
import { parsePDF } from "../utils/pdfParser";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const FileUploader = () => {
  const [fileType, setFileType] = useState("csv");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    setLoading(true);

    if (fileType === "csv") {
      parseCSV(file, (data) => {
        setPreviewData(data.slice(0, 5));
        setLoading(false);
      });
    } else if (fileType === "excel") {
      parseExcel(file, (data) => {
        setPreviewData(data.slice(0, 5));
        setLoading(false);
      });
    } else if (fileType === "pdf") {
      parsePDF(file).then((data) => {
        setPreviewData(data.slice(0, 5));
        setLoading(false);
      });
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    setLoading(true);

    if (fileType === "csv") {
      parseCSV(selectedFile, (data) => {
        setLoading(false);
        navigate("/dashboard", { state: { data, fileType } });
      });
    } else if (fileType === "excel") {
      parseExcel(selectedFile, (data) => {
        setLoading(false);
        navigate("/dashboard", { state: { data, fileType } });
      });
    } else if (fileType === "pdf") {
      parsePDF(selectedFile).then((data) => {
        setLoading(false);
        navigate("/dashboard", { state: { data, fileType } });
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6">📂 Upload Your Data</h2>

      {/* Select Input Type */}
      <div className="mb-4">
        <label className="mr-2 font-medium text-gray-700">Choose file type:</label>
        <select
          value={fileType}
          onChange={(e) => {
            setFileType(e.target.value);
            setSelectedFile(null);
            setPreviewData([]);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="csv">CSV (.csv)</option>
          <option value="excel">Excel (.xlsx)</option>
          <option value="pdf">PDF (.pdf)</option>
        </select>
      </div>

      {/* File Input */}
      <input
        key={fileType} // reset file input on change
        type="file"
        accept={
          fileType === "csv"
            ? ".csv"
            : fileType === "excel"
            ? ".xlsx, .xls"
            : ".pdf"
        }
        onChange={handleFileChange}
        className="mb-4 border p-2 rounded w-full max-w-md"
      />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      >
        Upload & Analyze
      </button>

      {/* Loader */}
      {loading && <Loader />}

      {/* Preview Table */}
      {!loading && previewData.length > 0 && (
        <div className="mt-6 w-full max-w-4xl overflow-auto bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-bold mb-2 text-gray-700">🔍 Preview (first 5 rows)</h3>
          <table className="w-full text-sm text-left text-gray-800 border">
            <thead className="bg-gray-200">
              <tr>
                {Object.keys(previewData[0] || {}).map((col, idx) => (
                  <th key={idx} className="px-3 py-2 border">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, idx) => (
                <tr key={idx} className="border-b">
                  {Object.values(row).map((cell, i) => (
                    <td key={i} className="px-3 py-2 border">
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
