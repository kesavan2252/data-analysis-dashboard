import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("lastUploadedFile");
    if (stored) setHasHistory(true);
  }, []);

  const noDataOnDashboard =
    location.pathname === "/dashboard" &&
    !(location.state && location.state.data && location.state.data.length);

  const isActive = (path) => {
    if (noDataOnDashboard && path === "/upload") return "text-blue-600 font-semibold";
    return location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-700";
  };

  const isCurrent = (path) => location.pathname === path && !noDataOnDashboard;

  // const handleHistoryClick = () => {
  //   const stored = localStorage.getItem("lastUploadedFile");
  //   if (stored) {
  //     const parsed = JSON.parse(stored);
  //     navigate("/dashboard", { state: parsed });
  //   }
  // };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-lg px-6 py-4 flex justify-between items-center border-b border-blue-100">
      {/* Logo with shapes */}
      <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-indigo-500"></div>
        Dashboard
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-8 items-center">
        {location.pathname !== "/" && (
          <>
            <Link
              to="/upload"
              className={`relative flex items-center gap-2 pb-1 group ${isActive("/upload")}`}
            >
              <div className="w-2 h-2 bg-blue-600 rotate-45"></div>
              Upload
              <span className={`absolute left-0 bottom-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full ${isCurrent("/upload") ? "w-full" : "w-0"}`}></span>
            </Link>

            {!noDataOnDashboard && (
              <Link
                to="/dashboard"
                className={`relative flex items-center gap-2 pb-1 group ${isActive("/dashboard")}`}
              >
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-blue-500"></div>
                Dashboard
                <span className={`absolute left-0 bottom-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full ${isCurrent("/dashboard") ? "w-full" : "w-0"}`}></span>
              </Link>
            )}
          </>
        )}

        {/* History Button (visible always if localStorage has file) */}
        {hasHistory && (
          <button
            onClick={() => navigate("/history")}
            className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded shadow-sm transition"
          >
            📜 History
          </button>
        )}
      </div>

      {/* Mobile Nav */}
      {location.pathname !== "/" && (
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? "✖" : "☰"}
        </button>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute right-6 top-16 bg-white/90 shadow-md rounded-lg w-40 py-2 flex flex-col z-50 border border-gray-200 backdrop-blur-sm">
          <Link
            to="/upload"
            onClick={() => setMobileOpen(false)}
            className={`px-4 py-2 hover:bg-gray-100 flex items-center gap-2 ${isActive("/upload")}`}
          >
            ◼ Upload
          </Link>
          {!noDataOnDashboard && (
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-2 hover:bg-gray-100 flex items-center gap-2 ${isActive("/dashboard")}`}
            >
              🔺 Dashboard
            </Link>
          )}
          {hasHistory && (
            <button
              onClick={() => navigate("/history")}
              className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-blue-700"
            >
              📜 History
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
