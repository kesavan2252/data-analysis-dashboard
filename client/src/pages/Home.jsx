import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white p-4">
      <h1 className="text-4xl font-bold mb-4">📊 Data Analysis Dashboard</h1>
      <p className="mb-6 text-gray-600 text-center max-w-xl">
        Upload your CSV, Excel, or PDF file to visualize and analyze data with statistics, charts, and more.
      </p>
      <Link
        to="/upload"
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Home;
