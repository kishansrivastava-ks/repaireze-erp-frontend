import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Login = lazy(() => import("../pages/Login"));
const NotFound = lazy(() => import("../pages/NotFound"));
const AppLayout = lazy(() => import("../layouts/AppLayout"));
const VerifyPin = lazy(() => import("../pages/VerifyPin"));

const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const AdminProfile = lazy(() => import("../pages/AdminDashboard/AdminProfile"));
const Staffs = lazy(() => import("../pages/AdminDashboard/Staffs"));
const AddStaff = lazy(() => import("../pages/AdminDashboard/AddStaff"));

const StaffLayout = lazy(() => import("../layouts/StaffLayout"));
const StaffProfile = lazy(() => import("../pages/StaffDashboard/StaffProfile"));
const AddCustomer = lazy(() => import("../pages/StaffDashboard/AddCustomer"));
const AddService = lazy(() => import("../pages/StaffDashboard/AddService"));
const AddVendor = lazy(() => import("../pages/StaffDashboard/AddVendor"));

export const routes = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verify-pin",
    element: <VerifyPin />,
  },
  {
    path: "/admin-dashboard",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <AdminProfile />,
      },
      {
        path: "profile",
        element: <AdminProfile />,
      },
      {
        path: "staffs",
        element: <Staffs />,
      },
      {
        path: "add-staff",
        element: <AddStaff />,
      },
    ],
  },
  {
    path: "/staff-dashboard",
    element: <StaffLayout />,
    children: [
      {
        path: "",
        element: <StaffProfile />,
      },
      {
        path: "profile",
        element: <StaffProfile />,
      },
      {
        path: "add-service",
        element: <AddService />,
      },
      {
        path: "add-customer",
        element: <AddCustomer />,
      },
      {
        path: "add-vendor",
        element: <AddVendor />,
      },
    ],
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];
