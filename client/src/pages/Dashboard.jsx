import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import Downloadable from "../components/Downloadable";
import SummaryCards from "../components/SummaryCards";
import DataTable from "../components/DataTable";
import TopBottomStats from "../components/TopBottomStats";
import DynamicChart from "../components/DynamicChart";
import CorrelationHeatmap from "../components/CorrelationHeatmap";
import BoxPlotViewer from "../components/BoxPlotViewer";
import TimeSeriesChart from "../components/TimeSeriesChart";
import GeoMapViewer from "../components/GeoMapViewer";
import { useNotification } from "../components/NotificationProvider";


const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, fileType, fileName } = location.state || {};
  const baseName = fileName ? fileName.split(".").slice(0, -1).join(".") : "dashboard";

  const { showNotification } = useNotification();
  const [downloadOpen, setDownloadOpen] = useState(false);

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

  

  const handleDownload = async (type) => {
    const content = document.getElementById("dashboard-content");
    if (!content) {
      showNotification({ message: "Nothing to download", type: "error" });
      return;
    }

    if (type === "csv") {
      try {
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `${baseName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification({ message: "CSV downloaded", type: "success" });
      } catch (csvErr) {
        console.error(csvErr);
        showNotification({ message: "CSV download failed", type: "error" });
      }
      return;
    }

    if (type === "excel") {
      try {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data");
        XLSX.writeFile(wb, `${baseName}.xlsx`);
        showNotification({ message: "Excel downloaded", type: "success" });
      } catch (xlsxErr) {
        console.error(xlsxErr);
        showNotification({ message: "Excel download failed", type: "error" });
      }
      return;
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-lg flex items-center"
        >
          ← Back
        </button>

        {/* Dashboard Title and File Info */}
        <div className="flex items-center space-x-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3983/3983689.png"
            alt="Dashboard Icon"
            className="w-8 h-8 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-600">
              File Type: <strong>{fileType.toUpperCase()}</strong>
            </p>
          </div>
        </div>

        {/* Download Dropdown (CSV / Excel) */}
        <div className="relative">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
            onClick={() => setDownloadOpen((prev) => !prev)}
          >
            ⬇ Data Export
          </button>
          {downloadOpen && (
            <div
              className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg z-20"
              onMouseLeave={() => setDownloadOpen(false)}
            >
              <button
                onClick={() => {
                  handleDownload("csv");
                  setDownloadOpen(false);
                }}
                className="w-full px-4 py-2 hover:bg-gray-100 text-left flex items-center gap-2"
              >
                🗎 CSV
              </button>
              <button
                onClick={() => {
                  handleDownload("excel");
                  setDownloadOpen(false);
                }}
                className="w-full px-4 py-2 hover:bg-gray-100 text-left flex items-center gap-2"
              >
                📈 Excel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Content to Download */}
      <div id="dashboard-content">
        <Downloadable filenameBase={`${baseName}-summary`}>
          <SummaryCards data={data} />
        </Downloadable>
        <Downloadable filenameBase={`${baseName}-stats`}>
          <TopBottomStats data={data} />
        </Downloadable>
        <Downloadable filenameBase={`${baseName}-dynamic-chart`}>
          <DynamicChart data={data} />
        </Downloadable>
        <Downloadable filenameBase={`${baseName}-heatmap`}>
          <CorrelationHeatmap data={data} />
        </Downloadable>
        <Downloadable filenameBase={`${baseName}-boxplot`}>
          <BoxPlotViewer data={data} />
        </Downloadable>
        <Downloadable filenameBase={`${baseName}-timeseries`}>
          <TimeSeriesChart data={data} />
        </Downloadable>
        <Downloadable filenameBase={`${baseName}-geomap`}>
          <GeoMapViewer data={data} />
        </Downloadable>
        <Downloadable filenameBase={`${baseName}-datatable`}>
          <div className="mt-10 overflow-auto border rounded-lg p-4 bg-white">
            <h3 className="text-lg font-semibold mb-3 text-blue-700">Data Table</h3>
            <DataTable data={data} />
          </div>
        </Downloadable>
      </div>
    </div>
  );
};

export default Dashboard;
