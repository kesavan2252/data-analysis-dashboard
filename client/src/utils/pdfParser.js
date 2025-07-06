import * as pdfjsLib from "pdfjs-dist";

// Set up the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export const parsePDF = async (file) => {
  const typedArray = new Uint8Array(await file.arrayBuffer());

  // Load the PDF document
  const pdf = await pdfjsLib.getDocument({
    data: typedArray,
  }).promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(" ");
    fullText += text + "\n";
  }

  // Debug: log the extracted text
  console.log("Extracted text:", fullText);

  // Use regex to split at each month name (handles your sample data)
  const rowRegex = /(January|February|March|April|May|June|July|August|September|October|November|December)/g;
  const parts = fullText.split(rowRegex).map(s => s.trim()).filter(Boolean);

  // The first part is the header
  const headerLine = parts.shift();
  const headers = headerLine.split(/\s+/);

  // Now, reconstruct rows
  const data = [];
  for (let i = 0; i < parts.length; i++) {
    const month = parts[i];
    // The next part should be the numbers for this month
    const numbers = parts[i + 1] ? parts[i + 1].split(/\s+/).map(Number) : [];
    if (month && numbers.length === 3) {
      const row = {};
      row[headers[0]] = month;
      for (let j = 1; j < headers.length; j++) {
        row[headers[j]] = numbers[j - 1];
      }
      data.push(row);
      i++; // Skip the numbers part
    }
  }

  // Debug: log the parsed data
  console.log("Parsed data:", data);

  return data;
};
// This function parses a PDF file and extracts structured data from it.