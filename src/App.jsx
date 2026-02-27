import React, { lazy, Suspense } from "react";
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

// Lazy pages
const Login = lazy(() => import("./Pages/Login"));
const Home = lazy(() => import("./Pages/Home"));
const ImportHistory = lazy(() => import("./Pages/ImportHistory"));
const UnclaimedTasksView = lazy(() => import("./Pages/Tasks/UnclaimedTasksView"));
const WorkQueue = lazy(() => import("./Pages/Tasks/WorkQueue"));
const Dashboard = lazy(() => import("./Pages/Dashboard/Dashboard"));
const Dashboardew = lazy(() => import("./Pages/Dashboard/DashboardNew"));
const Form = lazy(() => import("./Pages/Builder/Form"));
const InputModule = lazy(() => import("./Pages/InputModule"));
const ModeSelection = lazy(() => import("./Pages/ModeSelection"));
const FormMappingClient = lazy(() => import("./Pages/FormMappingClient"));
const FieldValidationRuleList = lazy(() => import("./Pages/FieldValidationRule/FieldValidationRuleList"));
const FieldValidationRuleForm = lazy(() => import("./Pages/FieldValidationRule/FieldValidationRuleForm"));
const FormBuilderForm = lazy(() => import("./Pages/Builder/FormBuilderForm"));
const FormBuilderList = lazy(() => import("./Pages/Builder/FormBuilderList"));
const WorkflowConfigurationList = lazy(() => import("./Pages/Workflow/WorkflowConfigurationList"));
const WorkflowConfigurationForm = lazy(() => import("./Pages/Workflow/WorkflowConfigurationForm"));
const MyClaimedTasks = lazy(() => import("./Pages/Tasks/MyClaimedTasks"));
const TaskAssignment = lazy(() => import("./Pages/Tasks/TaskAssignment"));
const TaskWorkingPage = lazy(() => import("./Pages/Tasks/TaskWorkingPage"));
const PayrollManagerDashboard = lazy(() => import("./Pages/PayrollOpsChecklist/PayrollManagerDashboard"));
const PayrollChecklistConfig = lazy(() => import("./Pages/PayrollOpsChecklist/PayrollChecklistConfig"));
const PayrollChecklistTaskDetails = lazy(() => import("./Pages/PayrollOpsChecklist/PayrollChecklistTaskDetails"));
const ClientChecklistMapping = lazy(() => import("./Pages/PayrollOpsChecklist/ClientChecklistMapping"));

const Forms = lazy(() => import("./Pages/Forms/Forms"));

const ActionRoute = lazy(() => import("./Pages/ActionRoute"));
const ClientSetup = lazy(() => import("./Pages/Client/ClientSetup"));
const ReportsDashboard = lazy(() => import("./Pages/Reports/ReportsDashboard"));
const AuditLogs = lazy(() => import("./Pages/System/AuditLogs"));
const SystemSettings = lazy(() => import("./Pages/System/SystemSettings"));

import ProtectedRoute from "./Routes/ProtectedRoute";
import Loading from "./Component/Loading";
import UnknownPage from "./Routes/UnknownPage";
import SessionExpire from "./Routes/SessionExpire";
import SidebarAppLayout from "./layout/SidebarAppLayout";

const Load = (Component) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

const router = createHashRouter([
  { path: "/login", element: Load(Login) },
  { path: "/session-expired", element: <SessionExpire /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <SidebarAppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: Load(Dashboard) },
      { path: "actions", element: Load(ActionRoute) },
      { path: "employee", element: Load(Home) },

      // Payroll Inputs
      { path: "inputs", element: Load(InputModule) },
      { path: "inputs/:templateID", element: Load(Form) },
      { path: "inputs/history", element: Load(ImportHistory) },

      // Tasks & Operations
      { path: "tasks/unclaimed", element: Load(WorkQueue) },
      { path: "tasks/claim", element: Load(TaskAssignment) },
      { path: "tasks/my", element: Load(MyClaimedTasks) },
      { path: "tasks/working/:id", element: Load(TaskWorkingPage) },
      { path: "tasks/working", element: Load(MyClaimedTasks) },

      // Checklist
      { path: "checklist", element: Load(PayrollManagerDashboard) },
      { path: "checklist-config", element: Load(PayrollChecklistConfig) },
      { path: "checklist-mapping", element: Load(ClientChecklistMapping) },
      { path: "checklist/task-details/:id", element: Load(PayrollChecklistTaskDetails) },

      // Configuration
      { path: "workflow-config", element: Load(WorkflowConfigurationList) },
      { path: "workflow-config/add", element: Load(WorkflowConfigurationForm) },
      { path: "workflow-config/edit/:id", element: Load(WorkflowConfigurationForm) },
      { path: "workflow/mode", element: Load(ModeSelection) },
      { path: "formbuilder", element: Load(FormBuilderList) },
      { path: "formbuilder/add", element: Load(FormBuilderForm) },
      { path: "formbuilder/edit/:id", element: Load(FormBuilderForm) },
      { path: "fieldValidationRule", element: Load(FieldValidationRuleList) },
      { path: "fieldValidationRule/add", element: Load(FieldValidationRuleForm) },
      { path: "fieldValidationRule/edit/:id", element: Load(FieldValidationRuleForm) },
      { path: "mapping-inputs", element: Load(FormMappingClient) },

      { path: "form", element: Load(Forms) },

      // Admin & System
      { path: "client-setup", element: Load(ClientSetup) },
      { path: "reports", element: Load(ReportsDashboard) },
      { path: "system/audit-logs", element: Load(AuditLogs) },
      { path: "system/settings", element: Load(SystemSettings) },
    ],
  },
  { path: "*", element: <UnknownPage /> },
]);

const App = () => <RouterProvider router={router} />;

export default App;
