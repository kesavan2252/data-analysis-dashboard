import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-white text-center px-4">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 flex items-center gap-2 mb-4">
         Data Analysis Dashboard
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl">
        Upload your CSV, Excel, or PDF file to visualize and analyze data with statistics,
        charts, and more.
      </p>
      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Upload CTA */}
        <button
          onClick={() => navigate("/upload")}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition"
        >
          <span role="img" aria-label="upload">📂</span>
          Upload Data
        </button>

        {/* Dashboard CTA */}
        
      </div>
    </div>
  );
};

export default Home;
