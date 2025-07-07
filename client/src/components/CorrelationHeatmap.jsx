import React from "react";
import Plot from "react-plotly.js";

const CorrelationHeatmap = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Get only numeric columns
  const numericKeys = Object.keys(data[0]).filter((key) =>
    data.every((row) => typeof row[key] === "number")
  );

  if (numericKeys.length < 2) {
    return (
      <div className="p-4 mt-4 bg-yellow-100 text-yellow-800 border rounded">
        ⚠️ Not enough numeric columns to generate a correlation heatmap.
      </div>
    );
  }

  // Correlation calculation
  const getCorrelation = (x, y) => {
    const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const avgX = mean(x);
    const avgY = mean(y);

    const numerator = x.reduce((acc, val, i) => acc + (val - avgX) * (y[i] - avgY), 0);
    const denominator = Math.sqrt(
      x.reduce((acc, val) => acc + (val - avgX) ** 2, 0) *
      y.reduce((acc, val) => acc + (val - avgY) ** 2, 0)
    );

    return denominator ? (numerator / denominator).toFixed(2) : 0;
  };

  const matrix = numericKeys.map((x) =>
    numericKeys.map((y) =>
      getCorrelation(
        data.map((row) => row[x]),
        data.map((row) => row[y])
      )
    )
  );

  return (
    <div className="mt-10 bg-white border p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4 text-blue-700">📉 Correlation Matrix</h2>

      <Plot
        data={[
          {
            z: matrix,
            x: numericKeys,
            y: numericKeys,
            type: "heatmap",
            colorscale: "YlGnBu",
            showscale: true,
          },
        ]}
        layout={{
          width: "100%",
          height: 450,
          autosize: true,
          margin: { l: 100, r: 50, b: 100, t: 30 },
        }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
        config={{ responsive: true }}
      />
    </div>
  );
};

export default CorrelationHeatmap;
