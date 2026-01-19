

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
  { key: "fieldValidationRuleForm", title: "Field Validation Rule", icon: "Settings2", PagePath: "../Pages/FieldValidationRuleList.jsx", PageEditPath: "../Pages/FieldValidationRuleForm.jsx" },
  { key: "templates", title: "Form / Excel Template", icon: "FileText", PagePath: "../Pages/Builder/FormBuilderList.jsx", PageEditPath: "../Pages/Builder/FormBuilderForm.jsx" },
  { key: "mapping-inputs", title: "Mapping Payroll Inputs to Clients", icon: "ArrowRightLeft", PagePath: "../Pages/PayrollInputMapping.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  // { key: "payroll-period", title: "Payroll Period", icon: "Calendar", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  // { key: "inputs-config", title: "Inputs Configuration", icon: "Database", PagePath: "../Pages/Builder/TemplateList.jsx", PageEditPath: "../Pages/Builder/TemplateEdit.jsx" },
  { key: "client-setup", title: "Client Setup", icon: "Building", PagePath: "../Pages/ModeSelection.jsx", PageEditPath: "" },
  { key: "workflow-config", title: "Workflow Configuration", icon: "Settings", PagePath: "../Pages/Workflow/WorkflowConfigurationList.jsx", PageEditPath: "../Pages/Workflow/WorkflowConfigurationForm.jsx" },
  { key: "config", title: "Configuration Menu", icon: "Settings2", PagePath: "../Pages/ConfigurationPage.jsx", PageEditPath: "../Pages/ConfigurationPage.jsx" },
];



// 🔹 Validation Types
export const ValidationTypes = [
  { label: "None", value: 0 },   // NONE
  { label: "Length", value: 1 },   // LENGTH
  { label: "Regex", value: 2 },    // REGEX
  { label: "Range", value: 3 },    // RANGE
  { label: "Custom", value: 4 },   // CUSTOM
];

// 🔹 Severity Levels
export const Severities = [
  { label: "None", value: 0 },   // NONE
  { label: "High", value: 1 },     // HIGH
  { label: "Medium", value: 2 },   // MEDIUM
  { label: "Low", value: 3 },      // LOW
];

// 🔹 Categories
export const Categories = [
  { label: "None", value: 0 },   // NONE
  { label: "Identity", value: 1 },   // IDENTITY
  { label: "Financial", value: 2 },  // FINANCIAL
  { label: "Contact", value: 3 },    // CONTACT
];

export const Modules = [
  { label: "None", value: 0 },
  { label: "Onboarding", value: 1 },
  { label: "Attendance", value: 2 },
  { label: "Expense", value: 3 },
  { label: "Payroll", value: 4 },
  { label: "Tax", value: 5 },
];

// ModeSelectionData
export const ModeSelectionData = [
  {
    id: "standard",
    name: "Standard Mode",
    iconName: "Database", // ✅ AppIcon name
    description:
      "Use predefined templates where data already follows system standards.",
    meaning:
      "Data must already be in system format. The system validates and processes it immediately.",
    features: [
      "Predefined system templates",
      "Fixed field structure",
      "Automatic validation",
      "Fast processing",
      "Minimal human involvement",
    ],
    processing: "System",
    dataType: "Structured",
    complexity: "Low",
    color: "bg-blue-50 border-blue-200",
  },
  {
    id: "flexible",
    name: "Flexible Mode",
    iconName: "FileSpreadsheet", // ✅ AppIcon name
    description:
      "Upload raw Excel/CSV files in any format. Data will be standardized later.",
    meaning:
      "You provide raw or legacy data. An admin or operations user maps and converts it into system standards before processing.",
    features: [
      "Accepts raw / client-specific data",
      "Custom column mapping",
      "Human review before processing",
      "Supports legacy formats",
      "Advanced data transformation",
    ],
    processing: "Human + System",
    dataType: "Raw / Unstructured",
    complexity: "Medium",
    color: "bg-green-50 border-green-200",
  },
];






/* =========================================================
 ✅ STATIC DATA (DROP-IN FOR UI / LOCAL TESTING)
 =========================================================
 Use this when:
 - Backend not ready
 - You want predictable demo data
 - UI / UX testing
*/

/* ----------------------------- ROLES ----------------------------- */
export const STATIC_ROLES = [
  { RoleCode: 1, Role_Name: "Admin" },
  { RoleCode: 2, Role_Name: "HR Manager" },
  { RoleCode: 3, Role_Name: "Reporting Manager" },
  { RoleCode: 4, Role_Name: "Finance" },
  { RoleCode: 5, Role_Name: "Operations" },
];

/* ----------------------------- WORKFLOW LIST ----------------------------- */
export const STATIC_WORKFLOWS = [
  {
    WorkflowCode: 101,
    WorkflowName: "Leave Approval Workflow",
    Description: "Standard leave approval with manager and HR",
    IsActive: true,
    DisplayOrder: 1
  },
  {
    WorkflowCode: 102,
    WorkflowName: "Expense Reimbursement",
    Description: "Multi-level approval for expense claims",
    IsActive: true,
    DisplayOrder: 2
  },
  {
    WorkflowCode: 103,
    WorkflowName: "Employee Onboarding",
    Description: "New joiner approval and verification flow",
    IsActive: true,
    DisplayOrder: 3
  },
];

/* ----------------------------- WORKFLOW DETAILS (EDIT MODE) ----------------------------- */
export const STATIC_WORKFLOW_DETAILS = {
  101: {
    Header: {
      WorkflowCode: 101,
      WorkflowName: "Leave Approval Workflow",
      Description: "Standard leave approval with manager and HR",
      IsActive: true,
      DisplayOrder: 1
    },
    Details: [
      {
        StepOrder: 1,
        StepName: "Manager Approval",
        ApproverRoleCode: 3, // Reporting Manager
        IsMandatory: true,
        Conditions: null,
        EscalationTo: 2, // HR Manager
        EscalationHours: 24,
        IsActive: true,
        DisplayOrder: 1
      },
      {
        StepOrder: 2,
        StepName: "HR Approval",
        ApproverRoleCode: 2, // HR Manager
        IsMandatory: true,
        Conditions: null,
        EscalationTo: null,
        EscalationHours: null,
        IsActive: true,
        DisplayOrder: 2
      },
    ],
  },

  102: {
    Header: {
      WorkflowCode: 102,
      WorkflowName: "Expense Reimbursement",
      Description: "Multi-level approval for expense claims",
      IsActive: true,
      DisplayOrder: 2
    },
    Details: [
      {
        StepOrder: 1,
        StepName: "Manager Review",
        ApproverRoleCode: 3,
        IsMandatory: true,
        Conditions: `{ "Amount": { "$lt": 5000 } }`,
        EscalationTo: 2,
        EscalationHours: 12,
        IsActive: true,
        DisplayOrder: 1
      },
      {
        StepOrder: 2,
        StepName: "Finance Approval",
        ApproverRoleCode: 4,
        IsMandatory: true,
        Conditions: `{ "Amount": { "$gte": 5000 } }`,
        EscalationTo: null,
        EscalationHours: null,
        IsActive: true,
        DisplayOrder: 2
      },
    ],
  },

  103: {
    Header: {
      WorkflowCode: 103,
      WorkflowName: "Employee Onboarding",
      Description: "New joiner approval and verification flow",
      IsActive: true,
      DisplayOrder: 3
    },
    Details: [
      {
        StepOrder: 1,
        StepName: "HR Verification",
        ApproverRoleCode: 2,
        IsMandatory: true,
        Conditions: null,
        EscalationTo: 1,
        EscalationHours: 24,
        IsActive: true,
        DisplayOrder: 1
      },
      {
        StepOrder: 2,
        StepName: "IT Asset Approval",
        ApproverRoleCode: 5,
        IsMandatory: true,
        Conditions: `{ "Department": "IT" }`,
        EscalationTo: null,
        EscalationHours: null,
        IsActive: true,
        DisplayOrder: 2
      },
    ],
  },
};

/* =========================================================
   🔁 HOW TO USE (TEMP REPLACEMENT)
   ========================================================= */

/**
 * Replace API calls like:
 *   AxiosInstance.post("/workflow")
 *
 * With:
 *   setWorkflows(STATIC_WORKFLOWS)
 */

/**
 * Replace:
 *   AxiosInstance.post(`/workflow/${id}`)
 *
 * With:
 *   const data = STATIC_WORKFLOW_DETAILS[id];
 *   setWorkflowName(data.Header.WorkflowName);
 *   setDescription(data.Header.Description);
 *   setSteps(data.Details);
 */

/**
 * Replace role API:
 *   setRoles(STATIC_ROLES)
 */

/* =========================================================
   🧠 BUSINESS MEANING (IMPORTANT)
   =========================================================
   - Workflow is generic
   - Steps are ROLE-based
   - Runtime engine resolves:
 *     Role → Actual Users
 *
 * UI stays stable even if employees change
 */
