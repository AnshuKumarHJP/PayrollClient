import ExcelJS from "exceljs";
import axios from "axios";

/**
 * PURLEY GENERIC EXCEL SERVICE
 * Handles fetching and parsing of any Excel file from a remote URL 
 * without any domain-specific (Task/Payroll) logic.
 */

/**
 * Fetches an Excel file from a URL and parses it into JSON.
 * Detects schema dynamically based on the file content.
 * 
 * @param {string} url - The URL of the Excel file
 * @param {Object} options - Configuration for parsing
 * @param {string} options.sheetName - Specific sheet to read (defaults to first worksheet)
 * @param {number} options.headerRow - Specific row for headers (optional auto-detection)
 * @returns {Promise<{rows: Array, columns: Array}>} - Parsed rows and dynamic columns
 */
export const fetchExcelData = async (url, options = {}) => {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: { 'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
        });

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(response.data);

        let worksheet = options.sheetName ? workbook.getWorksheet(options.sheetName) : workbook.worksheets[0];
        if (!worksheet) worksheet = workbook.worksheets[0];

        if (!worksheet) throw new Error("No readable worksheet found");

        const rows = [];
        const columns = [];

        // 1. DYNAMIC HEADER DETECTION
        let headerRowNumber = options.headerRow || 1;
        let headerRow = worksheet.getRow(headerRowNumber);

        // Auto-detect: if first row is mostly empty/merge-cell (titles), check next row
        if (!options.headerRow && headerRow.actualCellCount <= 1) {
            headerRowNumber = 2;
            headerRow = worksheet.getRow(2);
        }

        // 2. GENERATE GENERIC COLUMNS
        headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            let label = cell.text || cell.value;
            if (label && typeof label === 'object') label = label.richText?.map(rt => rt.text).join("") || label.toString();

            const cleanLabel = label ? label.toString().trim() : `Col_${colNumber}`;
            const key = cleanLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');

            // Infer type based on the first data row cell type if possible
            const SampleCell = worksheet.getRow(headerRowNumber + 1).getCell(colNumber);
            let inferredType = "text";
            if (SampleCell.type === ExcelJS.ValueType.Number) inferredType = "number";
            if (SampleCell.type === ExcelJS.ValueType.Date) inferredType = "date";

            columns.push({
                name: key,
                label: cleanLabel,
                type: inferredType,
                headerCell: colNumber // reference for data extraction
            });
        });

        // 3. EXTRACT GENERIC DATA
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber <= headerRowNumber) return;

            const rowObject = {};
            let hasValidData = false;

            columns.forEach((col) => {
                const cell = row.getCell(col.headerCell);
                let value = cell.value;

                // Strip complex objects (richText, formulas, etc) to raw values
                if (value && typeof value === 'object') {
                    if (value.richText) value = value.richText.map(rt => rt.text).join("");
                    else if (value.text) value = value.text;
                    else if (value.result !== undefined) value = value.result;
                }

                rowObject[col.name] = value;
                if (value !== null && value !== undefined && value !== "") hasValidData = true;
            });

            if (hasValidData) {
                // Generate a generic unique row key if none exists
                rowObject.id = rowObject.id || rowObject.uuid || `row_${rowNumber}`;
                rows.push(rowObject);
            }
        });

        return { rows, columns };
    } catch (error) {
        console.error("Excel Service Error:", error);
        throw error;
    }
};

/**
 * Generic data sanitizer
 * Normalizes values based on basic types
 */
export const sanitizeData = (rows, columns) => {
    return rows.map(row => {
        const cleanRow = { ...row };
        columns.forEach(col => {
            if (col.type === "number") {
                const val = parseFloat(cleanRow[col.name]);
                cleanRow[col.name] = isNaN(val) ? 0 : val;
            }
            if (col.type === "date" && cleanRow[col.name]) {
                const date = new Date(cleanRow[col.name]);
                cleanRow[col.name] = isNaN(date.getTime()) ? cleanRow[col.name] : date.toISOString().split('T')[0];
            }
        });
        return cleanRow;
    });
};
