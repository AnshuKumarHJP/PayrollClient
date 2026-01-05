

export const severityLevels = [
  {
    id: "1",
    value: "error",
    label: "Error",
    color: "bg-red-100 text-red-800",
    description: "Critical validation error that prevents submission"
  },
  {
    id: "2",
    value: "warning",
    label: "Warning",
    color: "bg-yellow-100 text-yellow-800",
    description: "Non-critical issue that should be reviewed"
  },
  {
    id: "3",
    value: "info",
    label: "Info",
    color: "bg-blue-100 text-blue-800",
    description: "Informational message for user awareness"
  }
]

export const Density = [
  { value: "compact", label: "Compact", icon: "Rows" },
  { value: "normal", label: "Normal", icon: "Grid2X2" },
  { value: "comfortable", label: "Comfortable", icon: "StretchVertical" }
];

export const DownloadTypes = [
  { value: "excel", label: "Excel", icon: "FileSpreadsheet" },
  { value: "csv", label: "CSV", icon: "FileDown" },
  { value: "json", label: "JSON", icon: "FileJson" },
  { value: "pdf", label: "PDF", icon: "FileText" }
];




/* -----------------------------------------------------------------------
   CONFIG MENU ITEMS
------------------------------------------------------------------------ */
export const menuItems = [
  { key: "fieldValidationRuleForm", title: "Field Validation Rule", icon: "Settings2", PagePath: "../Pages/FieldValidationRuleForm.jsx", PageEditPath: "../Pages/FieldValidationRuleForm.jsx" },
  { key: "templates", title: "Form / Excel Templates", icon: "FileText", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  { key: "templates-preview", title: "Template Preview", icon: "FileText", PagePath: "../Pages/Builder/ExcelTemplatePreview.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  { key: "rule-types", title: "Validation Rule Types", icon: "ShieldCheck", PagePath: "../Pages/RuleTypesManagement.jsx", PageEditPath: "../Pages/RuleTypesManagement.jsx" },
  { key: "mapping-inputs", title: "Mapping Payroll Inputs to Clients", icon: "ArrowRightLeft", PagePath: "../Pages/PayrollInputMapping.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  // { key: "payroll-period", title: "Payroll Period", icon: "Calendar", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  // { key: "inputs-config", title: "Inputs Configuration", icon: "Database", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  // { key: "client-setup", title: "Client Setup", icon: "Building", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  { key: "config", title: "Configuration Menu", icon: "Settings2", PagePath: "../Pages/ConfigurationPage.jsx", PageEditPath: "../Pages/ConfigurationPage.jsx" },
];
