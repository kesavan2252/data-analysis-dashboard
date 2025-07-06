import React from "react";

const DataTable = ({ data }) => {
  if (!data || data.length === 0) return <p className="text-red-600">No data available</p>;

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-auto max-w-full border rounded-lg shadow mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-100">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((row, idx) => (
            <tr key={idx}>
              {headers.map((header, j) => (
                <td key={j} className="px-4 py-2 text-sm text-gray-800">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
