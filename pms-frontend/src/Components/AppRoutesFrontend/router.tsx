// router.tsx
import { createBrowserRouter} from "react-router-dom";
import App from "../../App";
import ProtectedRoute from "../protectRoutes/protectedRoute";

import userRoutes from "./userFrontendRoutes";
import doctorRoutes from "./doctorFrontendRoutes";
import patientRoutes from "./patientFrontendRoutes";
import DoctorDashboard from "../dashboards/doctorDashboard";
import PatientDashboard from "../dashboards/patientDashboards";
import PublicDashboard from "../dashboards/publicDashboard";
// import PageWrapper from "../../pageWrapper";
import adminRoutes from "./adminRoutes/adminFrontentRoutes";
import RoutesErrorBoundary from "../../utils/routesErrorBoundary";
import PageWrapper from "../../pageWrapper";



// interface AppRoute extends Omit<RouteObject, 'element'> {
//   element: ReactNode;
//   public?: boolean;
// }


export const myRouter = createBrowserRouter([
 {
  path: "/",
  element: <App />,
  errorElement:<RoutesErrorBoundary />,
  children: [
    {
      element: <PageWrapper />,   // only ONE place!
      children: [
        {
          element: <PublicDashboard />,
          children: userRoutes
        },
        {
          path: "/patient-dashboard",
          element: (
            <ProtectedRoute allowedRoles={["patient"]} redirectPath={"/login"} >
              <PatientDashboard />
            </ProtectedRoute>
          ),
          children: patientRoutes
        },
        {
          path: "/doctor-dashboard",
          element: (
            <ProtectedRoute allowedRoles={["doctor"]} redirectPath={"/login"}>
              <DoctorDashboard />
            </ProtectedRoute>
          ),
          children: doctorRoutes
        },

        ...adminRoutes
        // {
        //   path: "/admin-dashboard",
        //   element: (
        //     <ProtectedRoute allowedRoles={["admin"]} redirectPath={"/login"} >
        //       <AdminDashboard />
        //     </ProtectedRoute>
        //   ),
        //   children: adminRoutes
        // }
      ]
    }
  ]
}
]);
