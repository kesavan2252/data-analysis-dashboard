import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const HistogramChart = ({ data }) => {
  const numericCols = Object.keys(data[0] || {}).filter(key => typeof data[0][key] === "number");

  return (
    <div className="mt-8 space-y-6">
      {numericCols.map((key, idx) => {
        const freq = {};

        data.forEach(row => {
          const val = row[key];
          if (!isNaN(val)) {
            const bucket = Math.floor(val / 10) * 10;
            freq[bucket] = (freq[bucket] || 0) + 1;
          }
        });

        const labels = Object.keys(freq).sort((a, b) => a - b);
        const counts = labels.map(label => freq[label]);

        const chartData = {
          labels,
          datasets: [
            {
              label: `Distribution of ${key}`,
              data: counts,
              backgroundColor: "rgba(255, 159, 64, 0.6)",
              borderColor: "rgba(255, 159, 64, 1)",
              borderWidth: 1,
            },
          ],
        };

        return (
          <div key={idx} className="bg-white rounded shadow p-4">
            <h4 className="text-lg font-bold mb-2 text-orange-600">📊 Histogram: {key}</h4>
            <Bar data={chartData} />
          </div>
        );
      })}
    </div>
  );
};

export default HistogramChart;
// This component renders a histogram chart for each numeric column in the data.
// It calculates frequency distribution by bucketing values into ranges and displays them using a bar chart.