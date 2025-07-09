import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useNotification } from "./NotificationProvider";

const Downloadable = ({ filenameBase = "export", children }) => {
  const ref = useRef(null);
  const { showNotification } = useNotification();
  const [open, setOpen] = useState(false);

  // ---------- helpers ----------
  const download = async (type) => {
    if (!ref.current) return;
    try {
      const imgData = await toPng(ref.current, { pixelRatio: 2 });
      if (type === "image") {
        const a = document.createElement("a");
        a.href = imgData;
        a.download = `${filenameBase}.png`;
        a.click();
      } else {
        const img = new Image();
        img.src = imgData;
        await img.decode();
        const pdf   = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const h     = (img.height / img.width) * width;
        pdf.addImage(imgData, "PNG", 0, 10, width, h);
        pdf.save(`${filenameBase}.pdf`);
      }
      showNotification({ message: `${type.toUpperCase()} downloaded`, type: "success" });
    } catch (e) {
      console.error(e);
      showNotification({ message: `Failed to capture ${type}`, type: "error", closable: true });
    } finally {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative group">
      {/* Child panel/chart/table */}
      {children}

      {/* Kebab icon: visible on hover or when menu open */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`absolute top-2 right-2 p-1 rounded hover:bg-gray-200
                    ${open ? "bg-gray-200" : "opacity-0 group-hover:opacity-100"}
                   transition`}
      >
        ⋮
      </button>

      {/* Pop-over */}
      {open && (
        <div className="absolute z-50 right-2 top-9 bg-white border rounded shadow-md w-32">
          <button
            onClick={() => download("image")}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
          >
            🖼 Image
          </button>
          <button
            onClick={() => download("pdf")}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
          >
            📄 PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default Downloadable;