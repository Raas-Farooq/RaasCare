
import './index.css';
import './App.css'
import patientRoutes from './Components/AppRoutesFrontend/patientFrontendRoutes';
import userRoutes from './Components/AppRoutesFrontend/userFrontendRoutes';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// import PatientDashboard from './Components/dashboards/patientDashboards';
// import Home from './Components/pages/home';
import doctorRoutes from './Components/AppRoutesFrontend/doctorFrontendRoutes';
import NotFound from './Components/pages/notFound';
import ProtectedRoute from './Components/protectRoutes/protectedRoute';
import adminRoutes from './Components/AppRoutesFrontend/adminFrontentRoutes';
import toast, { Toaster } from 'react-hot-toast';
import {useEffect, useState } from 'react';

import Home from './Home/home';
import { useAuth } from './context/appContext';
import AllDoctors from './features/Doctor/allDoctorsList';
import ScrollToTop from './Components/scrollToTop';


    function App() {
      
      const {userRole, isAuthenticated,loading} = useAuth();
      const [allowedRoles, setAllowedRoles] = useState([]);


      useEffect(() => {
        console.log("Inside App.tsx  isAuthenticated: ", isAuthenticated, "allowedRoles", allowedRoles, "userRole ", userRole) 
      },[isAuthenticated, userRole])

      
      if(loading) return <h1>Loading..</h1>
      return (
        <div>
          <ScrollToTop />
          <Toaster position='top-center'/>
          <Routes>    
              <Route path="/" element={<Home />} />
              {userRoutes.map((route,index) => (
                <Route key={`user-${index}`} {...route} />
              ))}             
              {doctorRoutes.map((route, index) => (
                  <Route key={`doctor-${index}`} path={route.path} element={
                    <ProtectedRoute 
                    isAuthenticated={isAuthenticated}
                    allowedRoles={['doctor']}
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
            {/* Patient Dashboard Routes */}
            {patientRoutes.map((route, index) =>(
                <Route key={`patient-${index}`} path={route.path} 
                element={
                  <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={['patient']}
                  userRole={userRole}
                  redirectPath='/login'
                  >
                    {route.element}
                  </ProtectedRoute>
                }>
                {route.children?.map((child, childIndex) => (
                  child.index? 
                  <Route key={`patient-child-${childIndex}`} index element={child.element} />
                  :
                  <Route key={`patient-child-${childIndex}`} path={child.path} element={child.element} />
                ))}
                </Route>
              ))}
                {adminRoutes.map((route, index) => (
                  <Route
                  key={`admin-${index}`}
                  path={route.path}
                  element={
                      <ProtectedRoute

                      allowedRoles={['admin']}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                      redirectPath={"/login"}
                      
                      >
                      {route.element}

                      </ProtectedRoute>
                    }
                    >
                      {route.children?.map((childRoute, childIndex) => (
                        childRoute.index ?
                        <Route key={`admin-child-${childIndex}`} index element={childRoute.element} />
                        :
                        <Route key={`admin-child-${childIndex}`} path={childRoute.path} element={childRoute.element} />
                      ))}
                    </Route>
                ))}
          </Routes>
          <Toaster />
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

