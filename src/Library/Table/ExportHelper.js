import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/* -------- helper -------- */
const getValue = (obj, path) =>
  path ? path.split(".").reduce((o, k) => o?.[k], obj) : obj;

/* -------- format value for export -------- */
export const formatValueForExport = (v, type) => {
  if (type === "date" && v) return new Date(v).toLocaleString();
  if (type === "boolean") return v ? "Yes" : "No";
  if (type === "number") return Number(v);
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object" && v !== null) return JSON.stringify(v);
  return v === null || v === undefined || v === "" ? "-" : v;
};

/* -------- export to Excel -------- */
export const exportExcel = (data, columns, filename = 'data.xlsx') => {
  // Validate inputs
  if (!Array.isArray(data)) {
    console.error('exportExcel: data must be an array');
    return;
  }
  if (!columns || !Array.isArray(columns)) {
    console.error('exportExcel: columns must be an array');
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  // Add headers
  const headers = columns.flatMap(g => (g.children && Array.isArray(g.children) ? g.children.map(col => col.label || 'Column') : []));
  worksheet.addRow(headers);

  // Add data rows
  data.forEach(row => {
    const rowData = columns.flatMap(g =>
      g.children && Array.isArray(g.children) ? g.children.map(col => {
        const raw = getValue(row, col.key);
        return col.render ? col.render(raw, row) : formatValueForExport(raw, col.type);
      }) : []
    );
    worksheet.addRow(rowData);
  });

  // Style headers
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6F3FF' }
  };

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    const headerLength = column.header ? String(column.header).length : 0;
    column.width = Math.max(10, headerLength + 2);
  });

  // Save file
  workbook.xlsx.writeBuffer().then(buffer => {
    saveAs(new Blob([buffer]), filename);
  });
};

/* -------- export to CSV -------- */
export const exportCSV = (data, columns, filename = 'data.csv') => {
  // Validate inputs
  if (!Array.isArray(data)) {
    console.error('exportCSV: data must be an array');
    return;
  }
  if (!columns || !Array.isArray(columns)) {
    console.error('exportCSV: columns must be an array');
    return;
  }

  const headers = columns.flatMap(g => (g.children && Array.isArray(g.children) ? g.children.map(col => col.label || 'Column') : [])).join(',');
  const rows = data.map(row =>
    columns.flatMap(g =>
      g.children && Array.isArray(g.children) ? g.children.map(col => {
        const raw = getValue(row, col.key);
        const value = col.render ? col.render(raw, row) : formatValueForExport(raw, col.type);
        // Escape commas and quotes in CSV
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }) : []
    ).join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};

/* -------- export to JSON -------- */
export const exportJSON = (data, columns, filename = 'data.json') => {
  // Validate inputs
  if (!Array.isArray(data)) {
    console.error('exportJSON: data must be an array');
    return;
  }
  if (!columns || !Array.isArray(columns)) {
    console.error('exportJSON: columns must be an array');
    return;
  }

  const exportData = data.map(row =>
    columns.reduce((acc, group) => {
      if (group.children && Array.isArray(group.children)) {
        group.children.forEach(col => {
          const raw = getValue(row, col.key);
          acc[col.label || 'Column'] = col.render ? col.render(raw, row) : formatValueForExport(raw, col.type);
        });
      }
      return acc;
    }, {})
  );

  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  saveAs(blob, filename);
};

/* -------- export to PDF -------- */
export const exportPDF = (data, columns, filename = 'data.pdf') => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text('Data Export', 14, 20);

  // Prepare table data
  const headers = columns.flatMap(g => g.children.map(col => col.label));
  const body = data.map(row =>
    columns.flatMap(g =>
      g.children.map(col => {
        const raw = getValue(row, col.key);
        return String(col.render ? col.render(raw, row) : formatValueForExport(raw, col.type));
      })
    )
  );

  // Add table
  autoTable(doc, {
    head: [headers],
    body: body,
    startY: 30,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [230, 243, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // Save file
  doc.save(filename);
};
