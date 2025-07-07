import React, { useState, useEffect } from "react";

const TopBottomStats = ({ data }) => {
  const numericCols = Object.keys(data[0] || {}).filter((key) =>
    typeof data[0][key] === "number"
  );

  const [selectedColumn, setSelectedColumn] = useState(numericCols[0]);
  const [topOrBottom, setTopOrBottom] = useState("top");
  const [count, setCount] = useState(5);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!selectedColumn) return;

    const sorted = [...data].sort((a, b) =>
      topOrBottom === "top"
        ? b[selectedColumn] - a[selectedColumn]
        : a[selectedColumn] - b[selectedColumn]
    );

    setResults(sorted.slice(0, count));
  }, [data, selectedColumn, topOrBottom, count]);

  return (
    <div className="mt-10 p-4 bg-white rounded-lg border">
      <h3 className="text-lg font-bold text-blue-700 mb-4">Top/Bottom N Stats</h3>

      {/* Form Controls */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        {/* Column Selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">Column:</label>
          <select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            {numericCols.map((col, idx) => (
              <option key={idx} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        {/* Top/Bottom Toggle */}
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">Type:</label>
          <select
            value={topOrBottom}
            onChange={(e) => setTopOrBottom(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>

        {/* Count Input */}
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">Count:</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            min="1"
            className="border px-3 py-1 rounded w-20"
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-auto">
        <table className="w-full text-sm text-left text-gray-700 border">
          <thead className="bg-blue-100">
            <tr>
              {Object.keys(results[0] || {}).map((col, idx) => (
                <th key={idx} className="px-3 py-2">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, idx) => (
              <tr key={idx} className="border-b">
                {Object.values(row).map((cell, i) => (
                  <td key={i} className="px-3 py-2">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopBottomStats;
