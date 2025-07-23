
import './index.css';
import './App.css'
import patientRoutes from './Components/AppRoutesFrontend/patientFrontendRoutes';
import userRoutes from './Components/AppRoutesFrontend/userFrontendRoutes';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// import PatientDashboard from './Components/dashboards/patientDashboards';
// import Home from './Components/pages/home';
import doctorRoutes from './Components/AppRoutesFrontend/doctorFrontendRoutes';
import DoctorDashboard from './Components/dashboards/doctorDashboard';
import Home from './Components/Home/home';
import NotFound from './Components/pages/notFound';
import AdminDashboard from './Components/dashboards/adminDashboard';
import { useState } from 'react';
import ProtectedRoute from './Components/protectRoutes/protectedRoute';

    function App() {

      const [isAuthenticated, setIsAuthenticated] = useState(true);
      const [allowedRoles, setAllowedRoles] = useState(['doctor']);
      const [userRole, setUserRole] = useState('doctor');
      return (
        <div>
          
          <Routes>
            <Route path="/" element={<Home />} />
            {userRoutes.map((route,index) => (
              <Route key={`user-${index}`} {...route} />
            ))}

            {/* Patient Dashboard Routes */}
            {patientRoutes.map((route, index) =>(
                <Route key={`patient-${index}`} path={route.path} element={route.element}>
                {route.children?.map((child, childIndex) => (
                  child.index? 
                  <Route key={`patient-child-${childIndex}`} index element={child.path} />
                  :
                  <Route key={`patient-child-${childIndex}`} path={child.path} element={child.element} />
                ))}
                </Route>
              ))}

              {/* Doctor Routes */}

              {/* <Route
               element={
                <ProtectedRoute
                    isAuthenticated={isAuthenticated}
                    allowedRoles={allowedRoles}
                    userRole={userRole}
                    redirectPath='/login'

                    ></ProtectedRoute>
               }
              >
               // you can define {doctorRoutes.map} so it will cover all the elements of doctor Route
               </Route> */}
                {doctorRoutes.map((route, index) => (
                  <Route key={`doctor-${index}`} path={route.path} element={
                    <ProtectedRoute 
                    isAuthenticated={isAuthenticated}
                    allowedRoles={allowedRoles}
                    userRole={userRole}
                    redirectPath='/login'

                    >
                      {route.element}
                    </ProtectedRoute>
                    }>
                    {route.children?.map((child, childIndex) => (
                      child.index ?
                        <Route key={`doctor-child-${childIndex}`} index element={child.element} />
                      :
                        <Route key={`doctor-child-${childIndex}`} path={child.path} element={child.element} />
                    ))}
                    <Route path="*" element={<NotFound />} />
                  </Route>
              
        ))}
              {/* {doctorRoutes.map((route, index) => (
                <Route key={`doctor-${index}`} path={route.path} element={route.element}>
                  {route.children?.map((child, childIndex) => (
                    child.index ?
                    <Route key={`doctor-child-${childIndex}`} index element={child?.element} />
                    :
                    <Route key={`doctor-child-${childIndex}`} path={child.path} element={child.element} />
                  ))}
                  </Route>
              ))} */}
          </Routes>

          {/* Toast Notification */}
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      )
}

export default App

{/* <div className="bg-gray-50 min-h-screen py-10">
      <div className="bg-white shadow-md rounded:lg px-6 py-8 w-full mx-auto max-w-3xl"> */}