import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SummaryCards from "../components/SummaryCards";
import ChartViewer from "../components/ChartViewer";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, fileType } = location.state || {};

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-semibold mb-4">⚠️ No data found</h2>
        <p className="mb-6">Please upload a file first.</p>
        <button
          onClick={() => navigate("/upload")}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Go to Upload
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <button
        onClick={() => navigate(-1)}
        className="mr-4 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-lg"
        aria-label="Back"
      >
        ←
      </button>
      <h1 className="text-3xl font-bold flex items-center">
        <img src="/assets/dashboard-svgrepo-com.svg" alt="Dashboard Icon" className="w-8 h-8 mr-2" />
        Dashboard
      </h1>
      <p className="mb-2 text-gray-600">File Type: <strong>{fileType.toUpperCase()}</strong></p>

      <SummaryCards data={data} />
      <ChartViewer data={data} />

      <div className="mt-10 overflow-auto border rounded-lg p-4 bg-white">
        <h3 className="text-lg font-semibold mb-3 text-blue-700">Raw Data Table</h3>
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-blue-100">
            <tr>
              {Object.keys(data[0] || {}).map((col, idx) => (
                <th key={idx} className="px-4 py-2">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b">
                {Object.values(row).map((cell, i) => (
                  <td key={i} className="px-4 py-2">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
