import React, { useState } from "react";

const DataTable = ({ data }) => {
  const [filterText, setFilterText] = useState("");
  const [filteredData, setFilteredData] = useState(data);

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

  const displayData = filterText ? filteredData : data;

  return (
    <div className="mt-8 overflow-auto border rounded-lg p-4 bg-white">
      <div className="mb-3">
        <input
          type="text"
          value={filterText}
          onChange={handleFilter}
          placeholder="🔍 Filter data..."
          className="border px-4 py-2 w-full max-w-md rounded"
        />
      </div>

      <h3 className="text-lg font-semibold mb-3 text-blue-700">📋 Filtered Data Table</h3>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-blue-100">
          <tr>
            {Object.keys(data[0] || {}).map((col, idx) => (
              <th key={idx} className="px-4 py-2">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, idx) => (
            <tr key={idx} className="border-b">
              {Object.values(row).map((cell, i) => (
                <td key={i} className="px-4 py-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
