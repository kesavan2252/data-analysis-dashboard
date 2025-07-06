export const calculateStats = (data, key) => {
  const values = data.map(row => Number(row[key])).filter(val => !isNaN(val));
  if (values.length === 0) return {};

  const total = values.reduce((a, b) => a + b, 0);
  const mean = (total / values.length).toFixed(2);

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0
    ? sorted[mid]
    : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);

  const modeMap = {};
  let maxCount = 0;
  let mode = null;

  values.forEach(val => {
    modeMap[val] = (modeMap[val] || 0) + 1;
    if (modeMap[val] > maxCount) {
      maxCount = modeMap[val];
      mode = val;
    }
  });

  return { mean, median, mode, max: Math.max(...values), min: Math.min(...values) };
};
