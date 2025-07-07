import React, { useState } from "react";

const DataTable = ({ data }) => {
  const allColumns = Object.keys(data[0] || {});
  const [filterText, setFilterText] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [visibleColumns, setVisibleColumns] = useState(new Set(allColumns));

  const handleFilter = (e) => {
    const keyword = e.target.value.toLowerCase();
    setFilterText(keyword);

    const result = data.filter((row) =>
      Object.values(row).some(
        (val) => String(val).toLowerCase().includes(keyword)
      )
    );
    setFilteredData(result);
  };

  const toggleColumn = (column) => {
    const newSet = new Set(visibleColumns);
    if (newSet.has(column)) {
      newSet.delete(column);
    } else {
      newSet.add(column);
    }
    setVisibleColumns(newSet);
  };

  const displayData = filterText ? filteredData : data;

  return (
    <div className="mt-8 overflow-auto border rounded-lg p-4 bg-white">
      {/* 🔍 Search Input */}
      <div className="mb-3">
        <input
          type="text"
          value={filterText}
          onChange={handleFilter}
          placeholder="🔍 Filter data..."
          className="border px-4 py-2 w-full max-w-md rounded"
        />
      </div>

      {/* ✅ Column Toggles */}
      <div className="mb-4 flex flex-wrap gap-3">
        {allColumns.map((col, idx) => (
          <label key={idx} className="flex items-center text-sm gap-1">
            <input
              type="checkbox"
              checked={visibleColumns.has(col)}
              onChange={() => toggleColumn(col)}
              className="accent-blue-600"
            />
            {col}
          </label>
        ))}
      </div>

      {/* 📋 Table */}
      <h3 className="text-lg font-semibold mb-3 text-blue-700">📂 Filtered Data Table</h3>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-blue-100">
          <tr>
            {allColumns.map(
              (col, idx) =>
                visibleColumns.has(col) && (
                  <th key={idx} className="px-4 py-2">{col}</th>
                )
            )}
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, idx) => (
            <tr key={idx} className="border-b">
              {allColumns.map(
                (col, i) =>
                  visibleColumns.has(col) && (
                    <td key={i} className="px-4 py-2">{row[col]}</td>
                  )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
