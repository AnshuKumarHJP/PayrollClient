import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
// Pages / Layout
import AppLayout from "./layout/AppLayout";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import ImportHistory from "./Pages/ImportHistory";
import TemplateList from "./Pages/Builder/TemplateList";
import TemplateEdit from "./Pages/Builder/TemplateEdit";
import WorkflowDashboard from "./Pages/WorkflowDashboard";
import WorkflowTasks from "./Pages/WorkflowTasks";
import TaskDetailView from "./Pages/TaskDetailView";
import ApproveRejectScreen from "./Pages/ApproveRejectScreen";
import AuditLogView from "./Pages/AuditLogView";
import ModeSelection from "./Pages/ModeSelection";
import ColumnMappingUI from "./Pages/ColumnMappingUI";
import MappedTemplatePreview from "./Pages/MappedTemplatePreview";
import OpsDashboard from "./Pages/OpsDashboard";
import UnclaimedTasksView from "./Pages/UnclaimedTasksView";
import TaskActionScreen from "./Pages/TaskActionScreen";
import TeamDashboard from "./Pages/TeamDashboard";
import ExcelTemplatePreview from "./Pages/Builder/ExcelTemplatePreview";
import Configuration from "./Pages/Configuration";
import Dashboard from "./Pages/Dashboard/Dashboard";
import SalaryRegister from "./Pages/SalaryRegister";
import RunPayroll from "./Pages/RunPayroll";
import Payslips from "./Pages/Payslips";
import RuleTypesManagement from "./Pages/RuleTypesManagement";
import PayrollInputMapping from "./Pages/PayrollInputMapping";
import ProtectedRoute from "./Routes/ProtectedRoute";
import Form from "./Pages/Builder/Form";
import Employee from "./Pages/Employee/Employee";
import InputModule from "./Pages/InputModule";
import Loading from "./Component/Loading";
import UnknownPage from "./Routes/UnknownPage";
import SessionExpire from "./Routes/SessionExpire";



const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,

  },
  {
    path:"*",
    element:<UnknownPage/>
  },
  {
    path:"/session-expired",
    element:<SessionExpire/>
  },
  {
    path: "/",
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      {
        index: true,          // "/"
        element: <Dashboard />,
      },
      // Unified Payroll Input Module
      {
        path: "inputs",
        element: <InputModule />,
      },
      {
        path: "inputs/:templateID",
        element: <Form />,
      },
      {
        path: "inputs/history",
        element: <ImportHistory />,
      },
      // Configuration Hub
      {
        path: "config",
        element: <Configuration />,
      },
      { path: "employee", element: <Employee /> },
      // Configurable Input Templates
      {
        path: "config/templates",
        element: <TemplateList />,
      },
      {
        path: "config/templates/edit/:id?",
        element: <TemplateEdit />,
      },
      {
        path: "config/rule-types",
        element: <RuleTypesManagement />,
      },
      {
        path: "config/mapping-inputs-clients",
        element: <PayrollInputMapping />,
      },
      {
        path: "config/templates/preview",
        element: <ExcelTemplatePreview />,
      },
      // Client Modes (Standard & Flexible)
      {
        path: "modes",
        element: <ModeSelection />,
      },
      {
        path: "modes/mapping",
        element: <ColumnMappingUI />,
      },
      {
        path: "modes/preview",
        element: <MappedTemplatePreview />,
      },
      // Multi-Step Verification Workflow
      {
        path: "workflow",
        element: <WorkflowDashboard />,
      },
      {
        path: "workflow/tasks",
        element: <WorkflowTasks />,
      },
      {
        path: "workflow/tasks/:id",
        element: <TaskDetailView />,
      },
      {
        path: "workflow/approve/:id",
        element: <ApproveRejectScreen />,
      },
      {
        path: "workflow/audit",
        element: <AuditLogView />,
      },
      // Team Operations & Task Distribution
      {
        path: "ops/dashboard",
        element: <OpsDashboard />,
      },
      {
        path: "ops/unclaimed",
        element: <UnclaimedTasksView />,
      },
      {
        path: "ops/action",
        element: <TaskActionScreen />,
      },
      {
        path: "team",
        element: <TeamDashboard />,
      },
      {
        path: "ops/performance",
        element: <TeamDashboard />,
      },
      { path: "processing/run", element: <RunPayroll /> },
      { path: "processing/register", element: <SalaryRegister /> },
      {
        path: "processing/payslips", element: <Payslips />
      }
        ],
  },
]);

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
