
import './index.css';
import './App.css'
import patientRoutes from './Components/AppRoutesFrontend/patientFrontendRoutes';
import userRoutes from './Components/AppRoutesFrontend/userFrontendRoutes';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import doctorRoutes from './Components/AppRoutesFrontend/doctorFrontendRoutes';
import NotFound from './Components/pages/notFound';
import ProtectedRoute from './Components/protectRoutes/protectedRoute';
import adminRoutes from './Components/AppRoutesFrontend/adminFrontentRoutes';
import { Toaster } from 'react-hot-toast';
import Home from './Home/home';
import { useAuth } from './context/appContext';
import { AnimatePresence } from 'framer-motion'
import PageWrapper from './pageWrapper';

function App() {

  const { userRole, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return <h1>Loading..</h1>
  return (
    <div>
      {/* <ScrollToTop /> */}
      <Toaster position='top-center' />
      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.key}>
          <Route path="/" element={
            <PageWrapper >
              <Home />
            </PageWrapper>}
          />
          {userRoutes.map((route, index) => (
            <Route key={`user-${index}`}
              path={route.path}
              element={<PageWrapper>{route.element}</PageWrapper>} />
          ))}

          {doctorRoutes.map((route, index) => (
            <Route key={`doctor-${index}`} path={route.path} element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={['doctor']}
                userRole={userRole}
                redirectPath='/login'

              >
                <PageWrapper>{route.element}</PageWrapper>
              </ProtectedRoute>
            }>
              {route.children?.map((child, childIndex) => (
                child.index ?
                  <Route key={`doctor-child-${childIndex}`} index element={<PageWrapper>{child.element}</PageWrapper>} />
                  :
                  <Route key={`doctor-child-${childIndex}`} path={child.path} element={<PageWrapper>{child.element}</PageWrapper>} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Route>

          ))}
          {/* Patient Dashboard Routes */}
          {patientRoutes.map((route, index) => (
            <Route key={`patient-${index}`} path={route.path}
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  allowedRoles={['patient']}
                  userRole={userRole}
                  redirectPath='/login'
                >
                  <PageWrapper>{route.element}</PageWrapper>
                </ProtectedRoute>
              }>
              {route.children?.map((child, childIndex) => (
                child.index ?
                  <Route key={`patient-child-${childIndex}`} index element={<PageWrapper>{child.element}</PageWrapper>} />
                  :
                  <Route key={`patient-child-${childIndex}`} path={child.path} element={<PageWrapper>{child.element}</PageWrapper>} />
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
                  <PageWrapper>{route.element}</PageWrapper>

                </ProtectedRoute>
              }
            >
              {route.children?.map((childRoute, childIndex) => (
                childRoute.index ?
                  <Route key={`admin-child-${childIndex}`} index element={<PageWrapper>{childRoute.element}</PageWrapper>} />
                  :
                  <Route key={`admin-child-${childIndex}`} path={childRoute.path} element={<PageWrapper>c{childRoute.element}</PageWrapper>} />
              ))}
            </Route>
          ))}
        </Routes>
      </AnimatePresence>
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

