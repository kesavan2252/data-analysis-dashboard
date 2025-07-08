import React, { useState } from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart } from "react-chartjs-2";
import { BoxPlotController, BoxAndWhiskers } from "chartjs-chart-box-and-violin-plot";

// Register all chart.js components and the box plot extension
ChartJS.register(...registerables, BoxPlotController, BoxAndWhiskers);

const BoxPlotViewer = ({ data }) => {
  // Always define hooks at the top level
  const numericKeys = data && data.length > 0
    ? Object.keys(data[0]).filter((key) =>
        data.every((row) => typeof row[key] === "number")
      )
    : [];
  const [selectedKey, setSelectedKey] = useState(numericKeys[0] || "");

  if (!data || data.length === 0) return null;

  // Extract values
  const values = data
    .map((row) => Number(row[selectedKey]))
    .filter((val) => !isNaN(val))
    .sort((a, b) => a - b);

  if (values.length < 5) {
    return (
      <div className="p-4 mt-6 bg-yellow-100 text-yellow-700 rounded">
        ⚠️ Not enough data for box plot. Minimum 5 values required.
      </div>
    );
  }

  const getBoxPlotStats = (vals) => {
    const q1 = vals[Math.floor(vals.length * 0.25)];
    const q2 = vals[Math.floor(vals.length * 0.5)];
    const q3 = vals[Math.floor(vals.length * 0.75)];
    const iqr = q3 - q1;
    const min = Math.max(vals[0], q1 - 1.5 * iqr);
    const max = Math.min(vals[vals.length - 1], q3 + 1.5 * iqr);

    return { min, q1, median: q2, q3, max };
  };

  const stats = getBoxPlotStats(values);

  const chartData = {
    labels: [selectedKey],
    datasets: [
      {
        label: `Distribution of ${selectedKey}`,
        backgroundColor: "#36A2EB",
        borderColor: "#0275d8",
        borderWidth: 2,
        outlierColor: "#FF6384",
        itemRadius: 3,
        data: [
          {
            min: stats.min,
            q1: stats.q1,
            median: stats.median,
            q3: stats.q3,
            max: stats.max,
          },
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Box Plot for ${selectedKey}`,
        font: { size: 18 },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="mt-10 bg-white p-6 border rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Box Plot Viewer</h2>

      {/* Column Selection */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mr-2">Select Numeric Column:</label>
        <select
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          {numericKeys.map((key, idx) => (
            <option key={idx} value={key}>{key}</option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="w-full max-w-xl mx-auto">
        <Chart type="boxplot" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default BoxPlotViewer;
