import React from "react";
import { useNavigate } from "react-router-dom";
import { FiBarChart2, FiPieChart, FiTrendingUp } from "react-icons/fi";
import { BsFileEarmarkSpreadsheet } from "react-icons/bs";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative overflow-hidden"
      
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-0"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 flex items-center gap-2 mb-4">
          <FiBarChart2 className="text-blue-600 text-5xl" />
          Data Analysis Dashboard
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl">
          Upload your <strong>CSV</strong>, <strong>Excel</strong>, or <strong>PDF</strong> file to
          visualize and analyze data with statistics, charts, and more.
        </p>

        {/* Feature Icons */}
        <div className="flex gap-6 justify-center mb-8 text-blue-600 text-3xl">
          <FiPieChart title="Pie Charts" />
          <FiTrendingUp title="Trends" />
          <BsFileEarmarkSpreadsheet title="Spreadsheets" />
        </div>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/upload")}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <span role="img" aria-label="upload">📂</span>
            Upload Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
