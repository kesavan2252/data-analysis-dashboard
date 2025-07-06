import * as XLSX from "xlsx";

export const parseExcel = (file, callback) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const workbook = XLSX.read(e.target.result, { type: "binary" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, {
      raw: true,
      defval: "",  // fill missing values
    });

    const cleanData = json.filter(row =>
      Object.values(row).some(value => value !== null && value !== "")
    );

    callback(cleanData);
  };

  reader.onerror = (err) => {
    console.error("Excel Parse Error:", err);
    callback([]);
  };

  reader.readAsBinaryString(file);
};
// Note: This function assumes the first sheet is the one to be parsed.
// It also assumes that the Excel file has a header row.