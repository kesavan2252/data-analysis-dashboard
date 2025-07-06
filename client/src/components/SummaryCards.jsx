import React from "react";
import { calculateStats } from "../utils/statsHelper";

const SummaryCards = ({ data }) => {
  const numericCols = Object.keys(data[0] || {}).filter(
    key => typeof data[0][key] === "number"
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
      {numericCols.map((key, idx) => {
        const stats = calculateStats(data, key);
        return (
          <div key={idx} className="bg-white shadow rounded p-4 border">
            <h3 className="text-lg font-semibold mb-2 text-blue-600">{key}</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>Mean: {stats.mean}</li>
              <li>Median: {stats.median}</li>
              <li>Mode: {stats.mode}</li>
              <li>Min: {stats.min}</li>
              <li>Max: {stats.max}</li>
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
