import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
        📊 Dashboard
      </Link>
      <div className="space-x-4">
        <Link to="/upload" className="text-gray-700 hover:text-blue-500 font-medium">
          Upload
        </Link>
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-500 font-medium">
          Dashboard
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
