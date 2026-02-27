

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

export const STATIC_ROLES = [
  { Code: "Client", Name: "Client" },
  { Code: "ClientManager", Name: "ClientManager" },
  { Code: "ComplianceMember", Name: "ComplianceMember" },
  { Code: "PayrollAdmin", Name: "PayrollAdmin" },
  { Code: "PayrollOps", Name: "PayrollOps" },
  { Code: "PayrollILTechnicalLead", Name: "PayrollILTechnicalLead" },
  { Code: "QcMember", Name: "QcMember" },
  { Code: "RBH", Name: "RegionalBusinessHead" },
  { Code: "SuperAdmin", Name: "SuperAdmin" }
];

export const ClientPortalWorkflowStatus = [
  { label: "RequestInitiated", value: 500 },
  { label: "PendingApproval", value: 1000 },
  { label: "Approved", value: 1500 },
  { label: "Rejected", value: 1600 },
  { label: "CandidatePushedToPort", value: 2000 },
  { label: "Failed", value: 400 },
  { label: "Voided", value: 401 },
];


// ModeSelectionData
export const ModeSelectionData = [
  {
    id: 1,
    name: "Standard Mode",
    iconName: "Zap",
    iconColor: "text-amber-500",
    badge: "Recommended",
    description:
      "Fastest processing. You upload data using our standardized system templates.",
    meaning:
      "Data must match our strict format. The system validates and processes it instantly.",
    features: [
      "Instant Validation",
      "Real-time Errors",
      "Immediate Processing",
      "Lower Cost",
    ],
    processing: "Automated",
    dataType: "Structured (Template)",
    turnaroundTime: "Instant",
    recommendedFor: "Mature processes, technically capable teams",
    color: "bg-amber-50 border-amber-200",
  },
  {
    id: 2,
    name: "Flexible Mode",
    iconName: "Layers",
    iconColor: "text-indigo-500",
    badge: "Premium Service",
    description:
      "We handle the complexity. Upload your raw files, and our team will map and standardize them.",
    meaning:
      "You provide raw or legacy data. Our operations team maps, cleans, and standardizes it before processing.",
    features: [
      "Any File Format",
      "Expert Review",
      "Data Transformation",
      "Legacy Support",
    ],
    processing: "Managed Service [ Human Intervention + System Validation ]",
    dataType: "Unstructured / Raw",
    turnaroundTime: "24-48 Hours",
    recommendedFor: "Complex data, legacy systems, non-standard exports",
    color: "bg-indigo-50 border-indigo-200",
  },
];





export const initialTasks = [
  {
    id: "15",
    title: "Employee Onboarding Flow",
    description: "Finalize the UX for the new employee onboarding steps including document upload and verification screens.",
    requester: "Jordan Lee",
    dept: "Product",
    estimate: "6h",
    priority: "High",
    dueDate: "2024-01-24",
    overdueDays: 0,
    tags: ["UX Design", "Figma"],
    progress: 0,
    comments: 4,
    attachments: 2,
    status: "Open",
    assignees: ["https://i.pravatar.cc/150?u=current"]
  },
  {
    id: "13",
    title: "Server Migration - Phase 1",
    description: "Migrate legacy database clusters to the new cloud infrastructure. Ensure zero downtime.",
    requester: "Tech Ops",
    dept: "Engineering",
    estimate: "24h",
    priority: "High",
    dueDate: "2024-02-01",
    overdueDays: 0,
    tags: ["DevOps", "AWS"],
    progress: 40,
    comments: 8,
    attachments: 1,
    status: "In Progress",
    assignees: ["https://i.pravatar.cc/150?u=current"]
  },
  {
    id: "16",
    title: "Client Feedback Analysis",
    description: "Analyze the latest batch of 500+ client survey responses and synthesize findings.",
    requester: "Customer Success",
    dept: "Operations",
    estimate: "8h",
    priority: "Low",
    dueDate: "2024-01-30",
    overdueDays: 0,
    tags: ["Analysis", "Reporting"],
    progress: 90,
    comments: 2,
    attachments: 4,
    status: "Review",
    assignees: ["https://i.pravatar.cc/150?u=current", "https://i.pravatar.cc/150?u=5"]
  },
  {
    id: "14",
    title: "Security Patch Deployment",
    description: "Deploy critical security patches to the production environment. Backup database before starting.",
    requester: "IT Security",
    dept: "IT",
    estimate: "4h",
    priority: "High",
    dueDate: "2024-01-28",
    overdueDays: 0,
    tags: ["Security", "Docker"],
    progress: 0,
    comments: 0,
    attachments: 1,
    status: "Open",
    assignees: ["https://i.pravatar.cc/150?u=current"]
  }
];




export const stats = [
  {
    id: 1,
    title: "My Active Tasks",
    value: 8,
    trend: "Currently working",
    trendUp: true,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    icon: "Layers"
  },
  {
    id: 2,
    title: "Pending Review",
    value: 3,
    trend: "Awaiting feedback",
    trendUp: null,
    color: "text-amber-600",
    bg: "bg-amber-50",
    icon: "Activity"
  },
  {
    id: 3,
    title: "Due This Week",
    value: 4,
    trend: "2 High priority",
    trendUp: false,
    color: "text-red-600",
    bg: "bg-red-50",
    icon: "Timer"
  },
  {
    id: 4,
    title: "Completed (Jan)",
    value: 24,
    trend: "+12% from last month",
    trendUp: true,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: "CheckCircle2"
  }
];

export const CHECKLIST_COMPLEXITY = {
  Low: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20" },
  Medium: { dot: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20" },
  High: { dot: "bg-orange-500", text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10", border: "border-orange-100 dark:border-orange-500/20" },
  Critical: { dot: "bg-rose-600", text: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-100 dark:border-rose-500/20" },
};

export const CHECKLIST_CATEGORY_COLORS = {
  Payroll: "from-[#4F46E5] to-[#7C3AED] dark:from-[#3730A3] dark:to-[#5B21B6]",
  Compliance: "from-[#E11D48] to-[#9F1239] dark:from-[#9F1239] dark:to-[#881337]",
  "HR Ops": "from-[#0EA5E9] to-[#0284C7] dark:from-[#075985] dark:to-[#0369A1]",
  Audit: "from-[#10B981] to-[#059669] dark:from-[#065F46] dark:to-[#064E3B]",
  Onboarding: "from-[#F97316] to-[#EA580C] dark:from-[#9A3412] dark:to-[#7C2D12]",
  Attendance: "from-[#3B82F6] to-[#2563EB] dark:from-[#1E40AF] dark:to-[#1E3A8A]",
  Expense: "from-[#14B8A6] to-[#0D9488] dark:from-[#115E59] dark:to-[#134E4A]",
  Tax: "from-[#EF4444] to-[#DC2626] dark:from-[#991B1B] dark:to-[#7F1D1D]",
  Identity: "from-[#06B6D4] to-[#0891B2] dark:from-[#155E75] dark:to-[#164E63]",
  Financial: "from-[#22C55E] to-[#16A34A] dark:from-[#166534] dark:to-[#14532D]",
  Contact: "from-[#8B5CF6] to-[#7C3AED] dark:from-[#6D28D9] dark:to-[#5B21B6]",
  Benefits: "from-[#EC4899] to-[#DB2777] dark:from-[#9D174D] dark:to-[#831843]",
  Recruitment: "from-[#A855F7] to-[#9333EA] dark:from-[#7E22CE] dark:to-[#6B21A8]",
  Training: "from-[#EAB308] to-[#CA8A04] dark:from-[#854D0E] dark:to-[#78350F]",
  Offboarding: "from-[#64748B] to-[#475569] dark:from-[#334155] dark:to-[#1E293B]",
};

export const CHECKLIST_CATEGORY_THEMES = {
  Payroll: { bg: "bg-indigo-600 dark:bg-indigo-500/10", border: "border-indigo-200 dark:border-indigo-500/20", text: "text-white dark:text-indigo-400", tint: "indigo" },
  Compliance: { bg: "bg-rose-600 dark:bg-rose-500/10", border: "border-rose-200 dark:border-rose-500/20", text: "text-white dark:text-rose-400", tint: "rose" },
  "HR Ops": { bg: "bg-sky-600 dark:bg-sky-500/10", border: "border-sky-200 dark:border-sky-500/20", text: "text-white dark:text-sky-400", tint: "sky" },
  Audit: { bg: "bg-emerald-600 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20", text: "text-white dark:text-emerald-400", tint: "emerald" },
  Onboarding: { bg: "bg-orange-600 dark:bg-orange-500/10", border: "border-orange-200 dark:border-orange-500/20", text: "text-white dark:text-orange-400", tint: "orange" },
  Attendance: { bg: "bg-blue-600 dark:bg-blue-500/10", border: "border-blue-200 dark:border-blue-500/20", text: "text-white dark:text-blue-400", tint: "blue" },
  Expense: { bg: "bg-teal-600 dark:bg-teal-500/10", border: "border-teal-200 dark:border-teal-500/20", text: "text-white dark:text-teal-400", tint: "teal" },
  Tax: { bg: "bg-red-600 dark:bg-red-500/10", border: "border-red-200 dark:border-red-500/20", text: "text-white dark:text-red-400", tint: "red" },
  Identity: { bg: "bg-cyan-600 dark:bg-cyan-500/10", border: "border-cyan-200 dark:border-cyan-500/20", text: "text-white dark:text-cyan-400", tint: "cyan" },
  Financial: { bg: "bg-green-600 dark:bg-green-500/10", border: "border-green-200 dark:border-green-500/20", text: "text-white dark:text-green-400", tint: "green" },
  Contact: { bg: "bg-violet-600 dark:bg-violet-500/10", border: "border-violet-200 dark:border-violet-500/20", text: "text-white dark:text-violet-400", tint: "violet" },
  Benefits: { bg: "bg-pink-600 dark:bg-pink-500/10", border: "border-pink-200 dark:border-pink-500/20", text: "text-white dark:text-pink-400", tint: "pink" },
  Recruitment: { bg: "bg-purple-600 dark:bg-purple-500/10", border: "border-purple-200 dark:border-purple-500/20", text: "text-white dark:text-purple-400", tint: "purple" },
  Training: { bg: "bg-amber-600 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-500/20", text: "text-white dark:text-amber-400", tint: "amber" },
  Offboarding: { bg: "bg-slate-700 dark:bg-slate-900/10", border: "border-slate-300 dark:border-slate-700/20", text: "text-white dark:text-slate-400", tint: "slate" },
};

export const CHECKLIST_CATEGORY_ICONS = {
  Payroll: "Banknote",
  Compliance: "ShieldCheck",
  "HR Ops": "Cpu",
  Audit: "Search",
  Onboarding: "UserPlus",
  Attendance: "Clock",
  Expense: "Receipt",
  Tax: "FileText",
  Identity: "Fingerprint",
  Financial: "CreditCard",
  Contact: "Info",
  Benefits: "Gift",
  Recruitment: "Briefcase",
  Training: "BookOpen",
  Offboarding: "UserMinus",
};

export const CHECKLIST_RISK_CONFIG = {
  Low: { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", icon: "ShieldCheck" },
  Medium: { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", icon: "AlertCircle" },
  High: { text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10", icon: "Zap" },
  Critical: { text: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10", icon: "Flame" },
  Ultra: { text: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10", icon: "ShieldAlert" },
};
