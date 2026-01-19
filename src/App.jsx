import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// Pages / Layout
import AppLayout from "./layout/AppLayout";

// Lazy-loaded pages
const Login = lazy(() => import("./Pages/Login"));
const Home = lazy(() => import("./Pages/Home"));
const ImportHistory = lazy(() => import("./Pages/ImportHistory"));
const WorkflowDashboard = lazy(() => import("./Pages/WorkflowDashboard"));
const WorkflowTasks = lazy(() => import("./Pages/WorkflowTasks"));
const TaskDetailView = lazy(() => import("./Pages/TaskDetailView"));
const ApproveRejectScreen = lazy(() => import("./Pages/ApproveRejectScreen"));
const AuditLogView = lazy(() => import("./Pages/AuditLogView"));
const OpsDashboard = lazy(() => import("./Pages/OpsDashboard"));
const UnclaimedTasksView = lazy(() => import("./Pages/UnclaimedTasksView"));
const TaskActionScreen = lazy(() => import("./Pages/TaskActionScreen"));
const TeamDashboard = lazy(() => import("./Pages/TeamDashboard"));
const Configuration = lazy(() => import("./Pages/Configuration"));
const Dashboard = lazy(() => import("./Pages/Dashboard/Dashboard"));
const SalaryRegister = lazy(() => import("./Pages/SalaryRegister"));
const RunPayroll = lazy(() => import("./Pages/RunPayroll"));
const Payslips = lazy(() => import("./Pages/Payslips"));
const Form = lazy(() => import("./Pages/Builder/Form"));
const Employee = lazy(() => import("./Pages/Employee/Employee"));
const InputModule = lazy(() => import("./Pages/InputModule"));
const ModeSelection = lazy(() => import("./Pages/ModeSelection"));

// Components / Routes
import ProtectedRoute from "./Routes/ProtectedRoute";
import Loading from "./Component/Loading";
import UnknownPage from "./Routes/UnknownPage";
import SessionExpire from "./Routes/SessionExpire";


/* ----------------------------------------------------------------
   WRAPPER — Avoid repeating <Suspense fallback={<Loading />} />
----------------------------------------------------------------- */
const Load = (Component) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);


const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,

  },
  {
    path: "*",
    element: <UnknownPage />
  },
  {
    path: "/session-expired",
    element: <SessionExpire />
  },
  {
    path: "/",
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      {
        index: true,          // "/"
        element: Load(Dashboard),
      },
      // Unified Payroll Input Module
      { path: "inputs", element: Load(InputModule), },
      { path: "inputs/:templateID", element: Load(Form), },
      {
        path: "inputs/history",
        element: Load(ImportHistory),
      },
      // Configuration Hub
      { path: "config/:tab", element: Load(Configuration) },
      { path: "config", element: Load(Configuration) },

      { path: "employee", element: Load(Employee) },
      // Multi-Step Verification Workflow
      {
        path: "workflow",
        element: Load(WorkflowDashboard),
      },
      {
        path: "workflow/mode",
        element: Load(ModeSelection),
      },
      {
        path: "workflow/tasks",
        element: Load(WorkflowTasks),
      },
      {
        path: "workflow/tasks/:id",
        element: Load(TaskDetailView),
      },
      {
        path: "workflow/approve/:id",
        element: Load(ApproveRejectScreen),
      },
      {
        path: "workflow/audit",
        element: Load(AuditLogView),
      },
      // Team Operations & Task Distribution
      {
        path: "ops/dashboard",
        element: Load(OpsDashboard),
      },
      {
        path: "ops/unclaimed",
        element: Load(UnclaimedTasksView),
      },
      {
        path: "ops/action",
        element: Load(TaskActionScreen),
      },
      {
        path: "team",
        element: Load(TeamDashboard),
      },
      {
        path: "ops/performance",
        element: Load(TeamDashboard),
      },
      { path: "processing/run", element: Load(RunPayroll) },
      { path: "processing/register", element: Load(SalaryRegister) },
      {
        path: "processing/payslips", element: Load(Payslips)
      }
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
