import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SummaryCards from "../components/SummaryCards";
import ChartViewer from "../components/ChartViewer";
import DataTable from "../components/DataTable";
import TopBottomStats from "../components/TopBottomStats";
import DynamicChart from "../components/DynamicChart";

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

  const handleDownload = async (type) => {
    const content = document.getElementById("dashboard-content");
    if (!content) return;

    const canvas = await html2canvas(content);
    const imgData = canvas.toDataURL("image/png");

    if (type === "image") {
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "dashboard.png";
      link.click();
    } else if (type === "pdf") {
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
      pdf.save("dashboard.pdf");
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

        {/* Download Dropdown */}
        <div className="relative group">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            ⬇ Download
          </button>
          <div className="absolute hidden group-hover:block right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-10">
            <button
              onClick={() => handleDownload("image")}
              className="w-full px-4 py-2 hover:bg-gray-100 text-left"
            >
              📷 Image
            </button>
            <button
              onClick={() => handleDownload("pdf")}
              className="w-full px-4 py-2 hover:bg-gray-100 text-left"
            >
              📄 PDF
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content to Download */}
      <div id="dashboard-content">
        <SummaryCards data={data} />
        {/* <ChartViewer data={data} /> */}
        <TopBottomStats data={data} />
        <DynamicChart data={data} />


        {/* Data Table */}
        <div className="mt-10 overflow-auto border rounded-lg p-4 bg-white">
          <h3 className="text-lg font-semibold mb-3 text-blue-700">
          Data Table
          </h3>
          <DataTable data={data} />

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
