import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

/* ============================================================================================
   1) DOWNLOAD EXCEL TEMPLATE (IMPROVED)
============================================================================================ */
export const downloadExcelTemplate = async (
  fields,
  sampleData,
  fileName = "template",
  clientName = ""
) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Payroll System";
  workbook.created = new Date();

  const filteredFields = fields?.filter(f => Array.isArray(f.applicable) && f.applicable.includes("upload"));

  const ws = workbook.addWorksheet("Data Entry");

  /* -------------------------
      ORGANIZATION NAME ROW
  -------------------------- */
  const orgRow = ws.addRow([clientName || "Organization"]);
  orgRow.font = { bold: true, size: 14 };
  orgRow.alignment = { horizontal: "center" };
  ws.mergeCells(1, 1, 1, filteredFields.length);

  /* -------------------------
      HEADER ROW (WITH COLORS)
  -------------------------- */
  const headerRow = ws.addRow(filteredFields.map((f) => f.label));
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4F81BD" },
  };
  headerRow.alignment = { horizontal: "center" };

  /* -------------------------
      REQUIRED FIELDS = ADD *
  -------------------------- */
  filteredFields.forEach((field, i) => {
    if (field.required) {
      ws.getCell(2, i + 1).value = {
        richText: [
          { text: field.label, font: { bold: true, color: { argb: "FFFFFFFF" } } },
          { text: " *", font: { bold: true, color: { argb: "FFFF0000" } } },
        ],
      };
    }
  });

  /* -------------------------
      SAMPLE DATA (OPTIONAL)
  -------------------------- */
  sampleData.forEach((obj) => {
    ws.addRow(filteredFields.map((f) => obj[f.name]));
  });

  /* -------------------------
      COLUMN WIDTH + VALIDATION
  -------------------------- */
  const START = 3;
  const END = 1000;

  filteredFields.forEach((field, index) => {
    const col = ws.getColumn(index + 1);
    col.width = Math.max(field.label.length + 4, 15);

    for (let r = START; r <= END; r++) {
      const cellRef = ws.getCell(r, index + 1).address;

      switch (field.type) {
        case "email":
          ws.getCell(r, index + 1).dataValidation = {
            type: "custom",
            formulae: [`=ISNUMBER(FIND("@",${cellRef}))`],
            errorTitle: "Invalid Email",
            error: "Enter a valid email address.",
            showErrorMessage: true,
          };
          break;

        case "number":
          ws.getCell(r, index + 1).dataValidation = {
            type: "decimal",
            errorTitle: "Invalid Number",
            error: "Enter a valid number.",
            showErrorMessage: true,
          };
          break;

        case "date":
          ws.getCell(r, index + 1).dataValidation = {
            type: "date",
            errorTitle: "Invalid Date",
            error: "Enter date in YYYY-MM-DD format.",
            showErrorMessage: true,
          };
          break;

        case "select":
          if (field.options?.length) {
            ws.getCell(r, index + 1).dataValidation = {
              type: "list",
              formulae: [`"${field.options.join(",")}"`],
              errorTitle: "Invalid Option",
              error: `Choose from: ${field.options.join(", ")}`,
              showErrorMessage: true,
            };
          }
          break;

        case "phone":
        case "mobile":
          ws.getCell(r, index + 1).dataValidation = {
            type: "custom",
            formulae: [
              `=AND(LEN(${cellRef})>=7,LEN(${cellRef})<=15,ISNUMBER(VALUE(SUBSTITUTE(SUBSTITUTE(${cellRef},"+","")," ",""))))`,
            ],
            errorTitle: "Invalid Phone",
            error: "Must be 7–15 digits (with optional +).",
            showErrorMessage: true,
          };
          break;
      }
    }
  });

  /* -------------------------
      INSTRUCTIONS SHEET
  -------------------------- */
  const ins = workbook.addWorksheet("Instructions");
  const instructions = [
    ["Excel Upload Instructions"],
    [""],
    ["1. Do NOT modify header row"],
    ["2. Fields marked with * are required"],
    ["3. Follow data validations"],
    ["4. Do not add/remove columns"],
    [""],
    ["Field Details:"],
    ...filteredFields.map((f) => [
      `${f.label}${f.required ? " *" : ""}`,
      f.type,
      f.required ? "Required" : "Optional",
      f.type === "select" ? f.options?.join(", ") : "",
    ]),
  ];
  instructions.forEach((row) => ins.addRow(row));

  ins.getColumn(1).width = 30;
  ins.getColumn(2).width = 15;

  /* -------------------------
      EXPORT FILE
  -------------------------- */
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `${fileName}_template.xlsx`
  );
};

/* ============================================================================================
   2) VALIDATE EXCEL STRUCTURE AGAINST TEMPLATE
============================================================================================ */
export const validateExcelStructure = async (file, fields) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());
    const ws = workbook.getWorksheet("Data Entry");

    if (!ws) {
      return { valid: false, error: 'Sheet "Data Entry" not found' };
    }

    const headerRow = ws.getRow(2);
    const expected = fields?.map((f) =>
      f.required ? `${f.label} *` : f.label
    );

    /* ✔ FIX 1: Extract RichText correctly */
    const extractedHeaders = headerRow.values
      .slice(1)
      .map((value) => {
        if (typeof value === "object" && value.richText) {
          return value.richText.map((rt) => rt.text).join("");
        }
        return value;
      });

    /* ✔ FIX 2: Compare both arrays safely */
    for (let i = 0; i < expected.length; i++) {
      if (extractedHeaders[i] !== expected[i]) {
        return {
          valid: false,
          error: `Header mismatch at column ${i + 1}. Expected "${expected[i]}", found "${extractedHeaders[i]}"`,
        };
      }
    }

    return {
      valid: true,
      sheetName: ws.name,
      rowCount: ws.rowCount - 2,
      columnCount: fields.length,
    };
  } catch (err) {
    return { valid: false, error: "Invalid Excel file: " + err.message };
  }
};

/* ============================================================================================
   3) READ EXCEL + FIELD VALIDATION ENGINE (IMPROVED)
============================================================================================ */
export const readExcelFile = async (file, template) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());

  const ws = workbook.getWorksheet("Data Entry");
  if (!ws) throw new Error('Missing "Data Entry" sheet');

  const rows = [];
  const errors = [];

  const fields = template.fields.filter(f => Array.isArray(f.applicable) && f.applicable.includes("upload")); // mapped by column

  ws.eachRow((row, rowNum) => {
    if (rowNum <= 2) return; // Skip org + header row

    let rowData = {};
    let rowErrors = [];
    let hasData = false;

    fields.forEach((field, i) => {
      const cell = row.getCell(i + 1);
      let value = cell.value;

      // Rich text fix
      if (value && typeof value === "object" && value.text) {
        value = value.text;
      }

      // Normalize empty cells
      if (value === "" || value === undefined || value === null) {
        value = null;
      } else {
        hasData = true;
      }

      // ONLY REQUIRED VALIDATION
      if (field.required && !value) {
        rowErrors.push(`${field.label} is required`);
      }

      // ⛔ NO TYPE VALIDATION
      // KEEP RAW VALUES, NO TRANSFORMATION
      rowData[field.name] = value;
    });

    if (hasData || rowErrors.length) {
      if (rowErrors.length === 0) rows.push(rowData);
      else errors.push({ row: rowNum, errors: rowErrors });
    }
  });

  return {
    rows,
    errors,
    totalRows: rows.length + errors.length,
    validRows: rows.length,
    invalidRows: errors.length,
  };
};

/* ============================================================================================
   4) DOWNLOAD CSV
============================================================================================ */
export const downloadCSV = (headers, data, fileName = "data") => {
  const csv = [
    headers.join(","),
    ...data.map((r) =>
      headers.map((h) => (r[h] ? `"${String(r[h]).replace(/"/g, '""')}"` : "")).join(",")
    ),
  ].join("\n");

  saveAs(
    new Blob([csv], { type: "text/csv" }),
    `${fileName}.csv`
  );
};
