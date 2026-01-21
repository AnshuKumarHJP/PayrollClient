/* =========================================================
   GENERIC AG GRID EXPORT HELPER
   Supports: Excel, CSV, PDF, JSON
   Works with: Any AG Grid (nested data supported)
   ========================================================= */

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* =========================================================
   SAFE NESTED VALUE RESOLVER
   Example: getValue(row, "participant.name")
   ========================================================= */
const getValue = (obj, path) =>
  path ? path.split(".").reduce((o, k) => o?.[k], obj) : obj;

/* =========================================================
   VALUE FORMATTER (EXPORT FRIENDLY)
   ========================================================= */
const formatValue = (value, type) => {
  if (type === "boolean") return value ? "Yes" : "No";
  if (type === "date" && value) return new Date(value).toLocaleString();
  if (type === "number") return Number(value);
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return value ?? "-";
};

/* =========================================================
   BUILD EXPORT COLUMNS FROM AG GRID (GENERIC)
   ========================================================= */
const buildExportColumns = (api) => {
  const columnApi = api.columnApi;

  if (!columnApi) {
    console.error('buildExportColumns: columnApi is not available');
    return [];
  }

  return columnApi
    .getAllDisplayedColumns() // respects visibility + order
    .map(col => col.getColDef())
    .filter(col =>
      col.field &&                 // must map to data
      !col.checkboxSelection &&    // skip checkbox column
      col.headerName !== "Actions" // skip UI/action columns
    )
    .map(col => ({
      key: col.field,              // supports dot-notation
      label: col.headerName || col.field,
      type: col.type || "string",
    }));
};

/* =========================================================
   MAIN EXPORT FUNCTION (CALL THIS)
   ========================================================= */
export const exportGridData = ({
  api,
  rowData,
  type,
  filename = "data",
}) => {
  if (!api) return;

  /* 1️⃣ rows: selected OR all */
  const selectedRows = api.getSelectedRows();
  const data = selectedRows.length ? selectedRows : rowData;

  /* 2️⃣ columns from grid */
  const columns = buildExportColumns(api);

  if (!columns.length) {
    console.warn("No exportable columns found");
    return;
  }

  /* 3️⃣ route export */
  if (type === "excel") return exportExcel(data, columns, `${filename}.xlsx`);
  if (type === "csv")   return exportCSV(data, columns, `${filename}.csv`);
  if (type === "pdf")   return exportPDF(data, columns, `${filename}.pdf`);
  if (type === "json")  return exportJSON(data, columns, `${filename}.json`);
};

/* =========================================================
   EXCEL EXPORT
   ========================================================= */
const exportExcel = async (data, columns, filename) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Data");

  sheet.addRow(columns.map(c => c.label));

  data.forEach(row => {
    sheet.addRow(
      columns.map(c =>
        formatValue(getValue(row, c.key), c.type)
      )
    );
  });

  sheet.getRow(1).font = { bold: true };
  sheet.columns.forEach(col => {
    col.width = Math.max(12, String(col.header || "").length + 2);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), filename);
};

/* =========================================================
   CSV EXPORT
   ========================================================= */
const exportCSV = (data, columns, filename) => {
  const header = columns.map(c => `"${c.label}"`).join(",");

  const rows = data.map(row =>
    columns.map(c => {
      const v = formatValue(getValue(row, c.key), c.type);
      return `"${String(v).replace(/"/g, '""')}"`;
    }).join(",")
  );

  const csv = [header, ...rows].join("\n");
  saveAs(new Blob([csv], { type: "text/csv" }), filename);
};

/* =========================================================
   PDF EXPORT
   ========================================================= */
const exportPDF = (data, columns, filename) => {
  const doc = new jsPDF();

  const headers = columns.map(c => c.label);
  const body = data.map(row =>
    columns.map(c =>
      String(formatValue(getValue(row, c.key), c.type))
    )
  );

  doc.text("Data Export", 14, 16);

  autoTable(doc, {
    head: [headers],
    body,
    startY: 22,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [240, 244, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  doc.save(filename);
};

/* =========================================================
   JSON EXPORT
   ========================================================= */
const exportJSON = (data, columns, filename) => {
  const json = data.map(row => {
    const obj = {};
    columns.forEach(c => {
      obj[c.label] = formatValue(
        getValue(row, c.key),
        c.type
      );
    });
    return obj;
  });

  saveAs(
    new Blob([JSON.stringify(json, null, 2)], {
      type: "application/json",
    }),
    filename
  );
};
