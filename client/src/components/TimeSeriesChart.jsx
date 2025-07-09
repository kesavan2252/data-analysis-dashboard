import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useNotification } from "../components/NotificationProvider";

// Utility: parse a variety of common date formats (ISO, mm-dd-yyyy, dd-mm-yyyy, mm/dd/yyyy, dd/mm/yyyy).
// Returns a valid Date instance or null if parsing fails.
const parseFlexibleDate = (value) => {
  if (!value) return null;

  // Already a Date object
  if (value instanceof Date && !isNaN(value)) return value;

  // Attempt native Date parsing first (handles ISO like 2023-05-12)
  const native = new Date(value);
  if (!isNaN(native)) {
    // Heuristic: if the result year is 1970 and the original string looks like a time, treat as invalid date
    if (
      native.getFullYear() === 1970 &&
      typeof value === "string" &&
      /:\d{2}/.test(value)
    ) {
      // likely a time-only string
    } else {
      return native;
    }
  }

  // Fallback: handle hyphen or slash separated formats (e.g. 12-05-2023 or 12/05/2023)
  const match = /^\s*(\d{1,2})[/-](\d{1,2})[/-](\d{4})\s*$/.exec(value);
  if (match) {
    let [, part1, part2, year] = match;
    part1 = parseInt(part1, 10);
    part2 = parseInt(part2, 10);
    year = parseInt(year, 10);

    let month, day;
    // Heuristic: whichever part is >12 must be the day.
    if (part1 > 12) {
      day = part1;
      month = part2;
    } else if (part2 > 12) {
      day = part2;
      month = part1;
    } else {
      // Ambiguous, default to MM-DD-YYYY
      month = part1;
      day = part2;
    }

    const constructed = new Date(year, month - 1, day);
    if (!isNaN(constructed)) return constructed;
  }

  // Parsing failed
  return null;
};

// Utility: parse flexible time strings (e.g., "9:47:41 AM", "15:30", "15:30:10")
const parseFlexibleTime = (value) => {
  if (!value) return null;

  // If already a Date (unlikely for time) but valid, return as-is
  if (value instanceof Date && !isNaN(value)) return value;

  // Normalise: prepend arbitrary date so Date parser can handle it
  const tryParse = new Date(`1970-01-01 ${value}`);
  if (!isNaN(tryParse)) return tryParse;

  return null;
};

const TimeSeriesChart = ({ data }) => {
  // Detect date and numeric keys
  const keys = data && data.length > 0 ? Object.keys(data[0]) : [];

  // A column qualifies as a date column only if EVERY row is parsable by our helper.
  const dateKey = keys.find(
    (key) => data && data.length > 0 && data.every((row) => parseFlexibleDate(row[key]))
  );

  // A column qualifies as a time column only if EVERY row is a parseable time string
  const timeKey = keys.find(
    (key) => data && data.length > 0 && data.every((row) => parseFlexibleTime(row[key]))
  );

  // Helper to decide if a value is purely numeric (either a number or a numeric string)
  const isNumericVal = (val) => {
    if (typeof val === "number") return !isNaN(val);
    if (typeof val === "string") {
      const trimmed = val.trim();
      // Accept integers or decimals, optional leading +/-
      return /^[-+]?\d+(?:\.\d+)?$/.test(trimmed);
    }
    return false;
  };

  // Accept only columns where every row is numeric **and** the values do NOT represent dates or times
  const numericKeys = keys.filter((key) => {
    if (!(data && data.length > 0)) return false;

    const everyNumeric = data.every((row) => isNumericVal(row[key]));
    // If even one STRING value parses as a date/time, exclude it from numerics
    const anyDateLike = data.some(
      (row) => typeof row[key] === "string" && parseFlexibleDate(row[key])
    );
    const anyTimeLike = data.some(
      (row) => typeof row[key] === "string" && parseFlexibleTime(row[key])
    );

    return everyNumeric && !anyDateLike && !anyTimeLike;
  });

  const hasNumeric = numericKeys.length > 0;
  const [selectedMetric, setSelectedMetric] = useState(hasNumeric ? numericKeys[0] : "");

  const { showNotification } = useNotification();
  const warnedRef = useRef(false);

  useEffect(() => {
    if (!warnedRef.current && (!dateKey || !timeKey)) {
      showNotification({
        message: "Dataset must contain at least one valid date and time column.",
        type: "warning",
        duration: 0,
        closable: true,
      });
      warnedRef.current = true;
    }
  }, [dateKey, timeKey, showNotification]);

  useEffect(() => {
    if (!data) {
      showNotification({
        message: "No data found. Please upload a file.",
        type: "warning",
        duration: 0,
        closable: true,
      });
    }
  }, [data, showNotification]);

  if (!data || data.length === 0) return null;

  if (!dateKey || !timeKey) {
    return null; // chart will not render; warning is handled via notification
  }
  

  // Guard against undefined selectedMetric after data changes
  if (hasNumeric && !selectedMetric) {
    setSelectedMetric(numericKeys[0] || "");
  }

  // Format data for chart
  let chartData;
  if (hasNumeric) {
    chartData = data
      .map((row) => {
        const parsedDate = parseFlexibleDate(row[dateKey]);
        const parsedTime = parseFlexibleTime(row[timeKey]);
        const numericVal = isNumericVal(row[selectedMetric]) ? Number(row[selectedMetric]) : NaN;
        if (!parsedDate || !parsedTime || isNaN(numericVal)) return null;

        const combined = new Date(
          parsedDate.getFullYear(),
          parsedDate.getMonth(),
          parsedDate.getDate(),
          parsedTime.getHours(),
          parsedTime.getMinutes(),
          parsedTime.getSeconds()
        );

        return {
          dateTime: combined,
          value: numericVal,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.dateTime - b.dateTime)
      .map(({ dateTime, value }) => ({
        dateTime: dateTime.toLocaleString("en-IN"),
        value,
      }));
  } else {
    // No numeric columns; compute row counts per date
    const counts = {};
    data.forEach((row) => {
      const parsedDate = parseFlexibleDate(row[dateKey]);
      const parsedTime = parseFlexibleTime(row[timeKey]);
      if (parsedDate && parsedTime) {
        const combined = new Date(
          parsedDate.getFullYear(),
          parsedDate.getMonth(),
          parsedDate.getDate(),
          parsedTime.getHours(),
          parsedTime.getMinutes(),
          parsedTime.getSeconds()
        );

        const label = combined.toLocaleString("en-IN");
        counts[label] = (counts[label] || 0) + 1;
      }
    });

    chartData = Object.entries(counts)
      .map(([dateTime, count]) => ({ dateTime, value: count }))
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  }

  return (
    <div className="mt-10 bg-white p-6 border rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-blue-700">📅 Time-Series Chart</h2>

      {hasNumeric && (
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mr-2">Metric:</label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            {numericKeys.map((key, idx) => (
              <option key={idx} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dateTime" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimeSeriesChart;
