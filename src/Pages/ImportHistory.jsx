/* =====================================================
   🚀 Import History + Workflow Timeline (Enterprise UX)
   ===================================================== */

import React, { useState } from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  User,
  Calendar,
  Database,
  Server,
  Download,
  AlertTriangle,
  RefreshCcw,
  Eye,
  MessageSquare,
  UserCheck,
  UserX,
} from "lucide-react";

/* ---------------- STATUS CONFIG ---------------- */
const STATUS = {
  completed: {
    label: "Completed",
    icon: CheckCircle,
    badge:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    ring: "ring-green-500/20",
  },
  processing: {
    label: "Processing",
    icon: Clock,
    badge:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    ring: "ring-yellow-500/20",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    badge:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    ring: "ring-red-500/20",
  },
};

/* ---------------- SMALL UI ---------------- */
const Metric = ({ label, value, color = "" }) => (
  <div className="text-center">
    <div className={`text-lg font-semibold ${color}`}>{value}</div>
    <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
  </div>
);

const Meta = ({ icon: Icon, text }) => (
  <span className="flex items-center gap-1">
    <Icon className="w-4 h-4" />
    {text}
  </span>
);

/* ---------------- WORKFLOW TIMELINE ---------------- */
const WorkflowTimeline = ({ steps }) => {
  return (
    <div className="relative pl-6 mt-4 border-l border-slate-300 dark:border-slate-700 space-y-6">
      {steps.map((s, i) => (
        <div key={i} className="relative">
          <span
            className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full flex items-center justify-center
              ${
                s.status === "approved"
                  ? "bg-green-500"
                  : s.status === "rejected"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }
            `}
          >
            {s.status === "approved" && (
              <UserCheck className="w-3 h-3 text-white" />
            )}
            {s.status === "rejected" && (
              <UserX className="w-3 h-3 text-white" />
            )}
            {s.status === "pending" && (
              <Clock className="w-3 h-3 text-white" />
            )}
          </span>

          <div className="ml-4 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="font-medium text-slate-800 dark:text-slate-100">
                {s.step}
              </div>
              <span className="text-xs text-slate-500">{s.time}</span>
            </div>

            <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
              <Meta icon={User} text={s.by} />
              <Meta icon={MessageSquare} text={s.comment || "—"} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ---------------- CARD ---------------- */
const ImportHistoryCard = ({ data,index }) => {
  const S = STATUS[data.status];
  const StatusIcon = S.icon;
  const [open, setOpen] = useState(false);

  return (
    <div
    key={index}
      className={`
        rounded-md border border-slate-200 dark:border-slate-800
        bg-white dark:bg-slate-900
        hover:shadow-md  transition-all
        ring-1 ${S.ring}
      `}
    >
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5">
        <div className="flex gap-4">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
            <StatusIcon className="w-6 h-6" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              {data.fileName}
            </h3>

            <div className="mt-1 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
              <Meta icon={User} text={data.uploadedBy} />
              <Meta icon={Calendar} text={data.uploadDate} />
              <Meta icon={Database} text={data.module} />
              <Meta icon={Server} text={data.environment} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${S.badge}`}>
            {S.label}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {data.duration}
          </span>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 px-5 pb-4">
        <Metric label="Total" value={data.total} />
        <Metric label="Success" value={data.success} color="text-green-600 dark:text-green-400" />
        <Metric label="Failed" value={data.failed} color="text-red-600 dark:text-red-400" />
        <Metric label="Skipped" value={data.skipped} />
        <Metric label="Warnings" value={data.warnings} />
        <Metric label="Validation Errors" value={data.validationErrors} />
      </div>

      {/* ACTION BAR */}
      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-5 py-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex gap-4">
          <Meta icon={AlertTriangle} text={data.importId} />
          <Meta icon={RefreshCcw} text={data.source} />
          <span>{data.size}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setOpen((p) => !p)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Eye className="w-4 h-4" />
            {open ? "Hide Workflow" : "View Workflow"}
          </button>

          {data.failed > 0 && (
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300">
              <Download className="w-4 h-4" />
              Error File
            </button>
          )}
        </div>
      </div>

      {/* WORKFLOW TIMELINE */}
      {open && (
        <div className="px-5 pb-5">
          <WorkflowTimeline steps={data.workflow} />
        </div>
      )}
    </div>
  );
};

/* ---------------- SAMPLE DATA ---------------- */
const SAMPLE = [
  {
    fileName: "employee_data_jan.xlsx",
    uploadedBy: "John Smith",
    uploadDate: "15 Jan 2024, 10:22 AM",
    module: "Employee",
    environment: "Production",
    status: "completed",
    total: 1250,
    success: 1245,
    failed: 5,
    skipped: 12,
    warnings: 7,
    validationErrors: 3,
    duration: "2m 30s",
    importId: "IMP-EMP-10231",
    source: "Manual Upload",
    size: "2.4 MB",
    workflow: [
      {
        step: "File Uploaded",
        by: "John Smith",
        status: "approved",
        time: "10:22 AM",
      },
      {
        step: "Manager Approval",
        by: "Anshu Kumar",
        status: "approved",
        time: "10:25 AM",
        comment: "Looks good",
      },
      {
        step: "HR Validation",
        by: "HR Team",
        status: "approved",
        time: "10:27 AM",
      },
      {
        step: "Import Executed",
        by: "System",
        status: "approved",
        time: "10:30 AM",
      },
    ],
  },
   {
    fileName: "employee_data_jan.xlsx",
    uploadedBy: "John Smith",
    uploadDate: "15 Jan 2024, 10:22 AM",
    module: "Employee",
    environment: "Production",
    status: "completed",
    total: 1250,
    success: 1245,
    failed: 5,
    skipped: 12,
    warnings: 7,
    validationErrors: 3,
    duration: "2m 30s",
    importId: "IMP-EMP-10231",
    source: "Manual Upload",
    size: "2.4 MB",
    workflow: [
      {
        step: "File Uploaded",
        by: "John Smith",
        status: "approved",
        time: "10:22 AM",
      },
      {
        step: "Manager Approval",
        by: "Anshu Kumar",
        status: "approved",
        time: "10:25 AM",
        comment: "Looks good",
      },
      {
        step: "HR Validation",
        by: "HR Team",
        status: "approved",
        time: "10:27 AM",
      },
      {
        step: "Import Executed",
        by: "System",
        status: "approved",
        time: "10:30 AM",
      },
    ],
  },
   {
    fileName: "employee_data_jan.xlsx",
    uploadedBy: "John Smith",
    uploadDate: "15 Jan 2024, 10:22 AM",
    module: "Employee",
    environment: "Production",
    status: "completed",
    total: 1250,
    success: 1245,
    failed: 5,
    skipped: 12,
    warnings: 7,
    validationErrors: 3,
    duration: "2m 30s",
    importId: "IMP-EMP-10231",
    source: "Manual Upload",
    size: "2.4 MB",
    workflow: [
      {
        step: "File Uploaded",
        by: "John Smith",
        status: "approved",
        time: "10:22 AM",
      },
      {
        step: "Manager Approval",
        by: "Anshu Kumar",
        status: "approved",
        time: "10:25 AM",
        comment: "Looks good",
      },
      {
        step: "HR Validation",
        by: "HR Team",
        status: "approved",
        time: "10:27 AM",
      },
      {
        step: "Import Executed",
        by: "System",
        status: "approved",
        time: "10:30 AM",
      },
    ],
  },
   {
    fileName: "employee_data_jan.xlsx",
    uploadedBy: "John Smith",
    uploadDate: "15 Jan 2024, 10:22 AM",
    module: "Employee",
    environment: "Production",
    status: "completed",
    total: 1250,
    success: 1245,
    failed: 5,
    skipped: 12,
    warnings: 7,
    validationErrors: 3,
    duration: "2m 30s",
    importId: "IMP-EMP-10231",
    source: "Manual Upload",
    size: "2.4 MB",
    workflow: [
      {
        step: "File Uploaded",
        by: "John Smith",
        status: "approved",
        time: "10:22 AM",
      },
      {
        step: "Manager Approval",
        by: "Anshu Kumar",
        status: "approved",
        time: "10:25 AM",
        comment: "Looks good",
      },
      {
        step: "HR Validation",
        by: "HR Team",
        status: "approved",
        time: "10:27 AM",
      },
      {
        step: "Import Executed",
        by: "System",
        status: "approved",
        time: "10:30 AM",
      },
    ],
  },
];

/* ---------------- PAGE ---------------- */
export default function ImportHistory() {
  return (
    <div className="min-h-screen  bg-slate-50 dark:bg-slate-950 space-y-4">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
        Import History
      </h2>

      {SAMPLE.map((item, i) => (
        <ImportHistoryCard key={i} data={item} />
      ))}
    </div>
  );
}
