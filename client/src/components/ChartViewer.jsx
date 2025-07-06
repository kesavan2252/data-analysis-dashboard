import React from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const ChartViewer = ({ data }) => {
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0]);
  const numericCols = keys.filter((key) => typeof data[0][key] === "number");
  const labelCol = keys.find((key) => typeof data[0][key] === "string") || "Label";

  const labels = data.map((row) => row[labelCol]);

  return (
    <div className="my-6 space-y-10">
      {numericCols.map((key, idx) => {
        const chartData = {
          labels,
          datasets: [
            {
              label: key,
              data: data.map((row) => row[key]),
              backgroundColor: [
                "rgba(75,192,192,0.6)",
                "rgba(255,99,132,0.6)",
                "rgba(54,162,235,0.6)",
              ],
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
            },
          ],
        };

        return (
          <div key={idx} className="space-y-4">
            <h4 className="text-xl font-bold text-gray-800">{key} Overview</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 shadow-md rounded">
                <Bar data={chartData} />
              </div>
              <div className="bg-white p-3 shadow-md rounded">
                <Line data={chartData} />
              </div>
              <div className="bg-white p-3 shadow-md rounded">
                <Pie data={chartData} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChartViewer;
