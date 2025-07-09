import React, { useState } from "react";
import { parseCSV } from "../utils/csvParser";
import { parseExcel } from "../utils/excelParser";
import { parsePDF } from "../utils/pdfParser";
import { useNavigate } from "react-router-dom";
import { useNotification } from "./NotificationProvider";
import Loader from "./Loader";

const FileUploader = () => {
  const [fileType, setFileType] = useState("csv");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setLoading(true);

    const parser =
      fileType === "csv"
        ? parseCSV
        : fileType === "excel"
        ? parseExcel
        : parsePDF;

    parser(file, (data) => {
      setPreviewData(data.slice(0, 5));
      setLoading(false);
    });
  };

  const handleUpload = () => {
    if (!selectedFile) {
      showNotification({ message: "Please select a file first.", type: "error" });
      return;
    }

    setLoading(true);

    const parser =
      fileType === "csv"
        ? parseCSV
        : fileType === "excel"
        ? parseExcel
        : parsePDF;

    parser(selectedFile, (data) => {
      setLoading(false);
      showNotification({ message: `${fileType.toUpperCase()} file uploaded successfully!`, type: "success" });
      navigate("/dashboard", {
        state: { data, fileType, fileName: selectedFile.name },
      });
    });
  };

  const fileIcons = {
    csv: "/csv.svg",
    excel: "/excel.svg",
    pdf: "/pdf.svg",
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center relative"
      style={{
        backgroundImage: "url('/assets/upload-bg.svg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-blue-100 to bg-green- 200 bg-opacity-0 backdrop-blur-md z-0" />

      <div className="z-10 relative max-w-3xl w-full bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-blue-700 flex items-center justify-center gap-3">
          <img src={fileIcons[fileType]} alt={fileType} className="w-10 h-10" />
          Upload Your Data
        </h2>

        {/* File type selector */}
        <div className="mb-5">
          <label className="mr-2 font-medium text-gray-700 text-lg">Choose file type:</label>
          <select
            value={fileType}
            onChange={(e) => {
              setFileType(e.target.value);
              setSelectedFile(null);
              setPreviewData([]);
            }}
            className="border px-3 py-2 rounded-md bg-white shadow-inner"
          >
            <option value="csv">CSV (.csv)</option>
            <option value="excel">Excel (.xlsx, .xls)</option>
            <option value="pdf">PDF (.pdf)</option>
          </select>
        </div>

        {/* File input */}
        <input
          key={fileType}
          type="file"
          accept={
            fileType === "csv"
              ? ".csv"
              : fileType === "excel"
              ? ".xlsx, .xls"
              : ".pdf"
          }
          onChange={handleFileChange}
          className="mb-4 w-full border border-gray-300 p-3 rounded shadow-sm focus:ring-2 focus:ring-blue-500 transition"
        />

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-xl"
        >
          🚀 Upload & Analyze
        </button>

        {/* Loader */}
        {loading && <Loader />}

        {/* Preview Data */}
        {!loading && previewData.length > 0 && (
          <div className="mt-8 w-full overflow-auto bg-white rounded-lg shadow-xl p-4 border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">🔍 Preview (first 5 rows)</h3>
            <table className="w-full text-sm text-left text-gray-700 border">
              <thead className="bg-blue-100">
                <tr>
                  {Object.keys(previewData[0] || {}).map((col, idx) => (
                    <th key={idx} className="px-3 py-2 border">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-100 transition">
                    {Object.values(row).map((cell, i) => (
                      <td key={i} className="px-3 py-2 border">{String(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
