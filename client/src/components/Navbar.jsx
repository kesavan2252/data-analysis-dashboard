import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const noDataOnDashboard =
    location.pathname === "/dashboard" && !(location.state && location.state.data && location.state.data.length);

  // Determine active colour. If we're on /dashboard without data, treat Upload as active.
  const isActive = (path) => {
    if (noDataOnDashboard && path === "/upload") return "text-blue-600 font-semibold";
    return location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-700";
  };

  // Helper to disable link interactions when it's the current page and data is valid
  const isCurrent = (path) => location.pathname === path && !noDataOnDashboard;

  return (
    <nav className="sticky top-0 z-510 bg-white/80 backdrop-blur-sm shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
        <span role="img" aria-label="logo">📈</span> Dashboard
      </Link>

      {/* Desktop Links */}
      {location.pathname !== "/" && (
        <div className="hidden md:flex space-x-6">
          {/* Upload Link */}
          <Link
            to="/upload"
            className={`flex items-center gap-1 relative pb-1 ${
              isActive("/upload")
            } before:absolute before:left-0 before:bottom-0 before:h-0.5 before:bg-blue-600 before:transition-all before:duration-300 ${
              isCurrent("/upload") ? "before:w-full pointer-events-none cursor-default" : "before:w-0 hover:before:w-full"
            }`}
          >
            <span role="img" aria-label="upload">📂</span> Upload
          </Link>

          {/* Dashboard Link (only if data present) */}
          {!noDataOnDashboard && (
            <Link
              to="/dashboard"
              className={`flex items-center gap-1 relative pb-1 ${
                isActive("/dashboard")
              } before:absolute before:left-0 before:bottom-0 before:h-0.5 before:bg-blue-600 before:transition-all before:duration-300 ${
                isCurrent("/dashboard") ? "before:w-full pointer-events-none cursor-default" : "before:w-0 hover:before:w-full"
              }`}
            >
              📊 Dashboard
            </Link>
          )}
        </div>
      )}

      {/* Hamburger Icon for Mobile */}
      {location.pathname !== "/" && (
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? "✖" : "☰"}
        </button>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute right-6 top-16 bg-white shadow-lg rounded-lg w-40 py-2 flex flex-col z-50">
          <Link
            to="/upload"
            onClick={() => setMobileOpen(false)}
            className={`px-4 py-2 hover:bg-gray-100 flex items-center gap-2 ${
              isActive("/upload")
            } ${isCurrent("/upload") ? "pointer-events-none cursor-default" : ""}`}
          >
            📂 Upload
          </Link>
          {/* Dashboard Link in mobile menu (only if data present) */}
          {!noDataOnDashboard && (
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-2 hover:bg-gray-100 flex items-center gap-2 ${
                isActive("/dashboard")
              } ${isCurrent("/dashboard") ? "pointer-events-none cursor-default" : ""}`}
            >
              📊 Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
