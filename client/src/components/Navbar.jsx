import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-700";

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
        📊 Dashboard
      </Link>
      <div className="space-x-6">
        <Link to="/upload" className={`${isActive("/upload")} hover:text-blue-600`}>
          Upload
        </Link>
        <Link to="/dashboard" className={`${isActive("/dashboard")} hover:text-blue-600`}>
          Dashboard
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
