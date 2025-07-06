import Papa from "papaparse";

export const parseCSV = (file, callback) => {
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: (results) => {
      const cleanData = results.data.filter(row =>
        Object.values(row).some(value => value !== null && value !== "")
      );
      callback(cleanData);
    },
    error: (err) => {
      console.error("CSV Parse Error:", err);
      callback([]);
    }
  });
};
