import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("uploadHistory")) || [];
    setHistory(stored);
  }, []);

  const handleView = (record) => {
    navigate("/dashboard", { state: record });
  };

  const handleDelete = (id) => {
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem("uploadHistory", JSON.stringify(updated));
    setHistory(updated);
  };

  const handleClearAll = () => {
    localStorage.removeItem("uploadHistory");
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📜 Upload History</h2>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-red-600 border border-red-400 hover:bg-red-50 px-4 py-1 rounded"
          >
            🗑 Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-gray-600">No past uploads found.</p>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{item.fileName}</p>
                <p className="text-sm text-gray-500">
                  Type: {item.fileType} |{" "}
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleView(item)}
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 text-red-500 border border-red-300 rounded hover:bg-red-100"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
