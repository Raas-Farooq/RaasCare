// router.tsx
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import App from "../../App";
import ProtectedRoute from "../protectRoutes/protectedRoute";

import userRoutes from "./userFrontendRoutes";
import doctorRoutes from "./doctorFrontendRoutes";
import patientRoutes from "./patientFrontendRoutes";
import adminRoutes from "./adminFrontentRoutes";
import DoctorDashboard from "../dashboards/doctorDashboard";
import type { ReactNode } from "react";
import PatientDashboard from "../dashboards/patientDashboards";
import AdminDashboard from "../dashboards/adminDashboard";

interface AppRoute extends Omit<RouteObject, 'element'> {
  element: ReactNode;
  public?: boolean;
}


export const myRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [

      // --------------------------
      // PUBLIC ROUTES
      // --------------------------
      // We map AppRoute to the required RouteObject structure here
      ...userRoutes.map((route: AppRoute) => ({
        path: route.path,
        element: route.element
      })),

      // --------------------------
      // DOCTOR ROUTES
      // Use optional chaining and nullish coalescing for safety
       {
        path: "/doctor-dashboard",
        element: <ProtectedRoute allowedRoles={["doctor"]} redirectPath="/login" />,
        children: doctorRoutes[0]?.children ?? [] 
      },

      // --------------------------
      // PATIENT ROUTES
      // Use optional chaining and nullish coalescing for safety
     {
        path: "/patient-dashboard",
        element: <ProtectedRoute allowedRoles={["patient"]} redirectPath="/login" />,
        children: patientRoutes[0]?.children ?? []
      },


      // --------------------------
      // ADMIN ROUTES
      // Use optional chaining and nullish coalescing for safety
      {
        path: "/admin-dashboard",
        element: <ProtectedRoute allowedRoles={["admin"]} redirectPath="/login" />,
        children: adminRoutes[0]?.children ?? []
      }

    ]
  }
]);
