import React, { useEffect, useRef, useMemo } from "react";
import { Chart, registerables } from "chart.js";
import {
  BoxPlotController,
  BoxAndWiskers,
  BoxPlotChart,
} from "@sgratzl/chartjs-chart-boxplot";

Chart.register(
  ...registerables,
  BoxPlotController,
  BoxAndWiskers,
);

const BoxPlotViewer = ({ data }) => {
  const canvasRef = useRef(null);

  // helper to detect numeric values (number or numeric string)
  const isNumeric = (v) => {
    if (typeof v === "number" && !Number.isNaN(v)) return true;
    if (typeof v === "string") {
      const n = Number(v);
      return v.trim() !== "" && !Number.isNaN(n);
    }
    return false;
  };

  // compute numeric column keys once per data change
  const numericKeys = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    return Object.keys(data[0]).filter((k) => isNumeric(data[0][k]));
  }, [data]);

  useEffect(() => {
    if (!data || data.length === 0 || numericKeys.length === 0) return;

    const datasets = numericKeys.map((key) => ({
      label: key,
      data: [data.map((row) => row[key]).filter((v) => !isNaN(v))],
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
      outlierColor: "#999",
      padding: 10,
      itemRadius: 0,
    }));

    if (canvasRef.current._chart) {
      canvasRef.current._chart.destroy();
    }

    canvasRef.current._chart = new Chart(canvasRef.current, {
      type: BoxPlotChart.id,
      data: {
        labels: numericKeys,
        datasets,
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "📦 Box-Plot Distribution",
          },
          tooltip: {
            mode: "nearest",
            intersect: false,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Columns",
            },
          },
          y: {
            title: {
              display: true,
              text: "Value range",
            },
          },
        },
      },
    });
  }, [data, numericKeys]);

  return (
    <div className="mt-10 bg-white p-6 border rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-blue-700">Box-Plot Viewer</h3>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default BoxPlotViewer;
