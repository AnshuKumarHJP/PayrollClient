import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages / Layout
import AppLayout from "./layout/AppLayout";

// Lazy-loaded pages
const Login = lazy(() => import("./Pages/Login"));
const Home = lazy(() => import("./Pages/Home"));
const ImportHistory = lazy(() => import("./Pages/ImportHistory"));
const UnclaimedTasksView = lazy(() => import("./Pages/UnclaimedTasksView"));
const Configuration = lazy(() => import("./Pages/Configuration"));
const Dashboard = lazy(() => import("./Pages/Dashboard/Dashboard"));
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

      { path: "employee", element: Load(Home) },
      // { path: "employee", element: Load(Employee) },
      // Multi-Step Verification Workflow
      {
        path: "workflow/mode",
        element: Load(ModeSelection),
      },
      {
        path: "ops/unclaimed",
        element: Load(UnclaimedTasksView),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
