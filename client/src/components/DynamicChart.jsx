import React, { useState, useMemo, useRef, useLayoutEffect, useEffect } from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  Tooltip, Legend, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const DynamicChart = ({ data }) => {
  // 1. Determine basic validity flags (no hooks yet needed)
  const validArray = Array.isArray(data) && data.length > 0;

  // 2. Hooks must be called unconditionally
  const numericKeys = useMemo(() => (
    validArray ? Object.keys(data[0]).filter(k => typeof data[0][k] === 'number') : []
  ), [validArray, data]);

  const [selectedKey, setSelectedKey] = useState(() => numericKeys[0] || '');
  const [chartType, setChartType] = useState('bar');

  // Update selectedKey when numericKeys change
  useEffect(() => {
    if (!numericKeys.includes(selectedKey)) {
      setSelectedKey(numericKeys[0] || '');
    }
  }, [numericKeys]);

  const chartData = useMemo(() => (
    validArray && selectedKey
      ? data
          .map((row, i) => ({
            name: row.name || row.Month || `Row ${i + 1}`,
            value: Number(row[selectedKey]),
          }))
          .filter(d => !isNaN(d.value))
      : []
  ), [validArray, data, selectedKey]);

  // width measurement hooks
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const measure = () => wrapRef.current && setWidth(wrapRef.current.offsetWidth);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /* ---------- early returns AFTER hooks ---------- */
  if (!validArray) {
    return <div className="p-4 mt-6 bg-red-100 text-red-700 rounded">⚠️ No valid data provided for chart rendering.</div>;
  }

  if (!numericKeys.length) {
    return <div className="p-4 mt-6 bg-yellow-100 text-yellow-700 rounded">⚠️ No numeric columns available for charting.</div>;
  }

  if (!chartData.length) {
    return <div className="p-4 mt-6 bg-yellow-100 text-yellow-700 rounded">⚠️ Selected column has no numeric values to chart.</div>;
  }

  return (
    <div className="mt-10 bg-white p-6 border rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-blue-700">📊 Dynamic Chart Viewer</h3>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">Column:</label>
          <select
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            {numericKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">Chart Type:</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </select>
        </div>
      </div>

      {/* Chart wrapper with fixed height */}
      <div ref={wrapRef} className="w-full" style={{ height: 400 }}>
        {width > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            {
              (chartType === 'bar') ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#00C49F" />
                </BarChart>
              ) : chartType === 'line' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              ) : (
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    fill="#8884d8"
                    label
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              )
            }
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DynamicChart;
