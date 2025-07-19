
import './index.css';
import './App.css'
import patientRoutes from './Components/AppRoutes/patientRoutes';
import userRoutes from './Components/AppRoutes/userRoutes';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import PatientDashboard from './Components/dashboards/patientDashboards';
import Home from './Components/pages/home';
    function App() {
      return (
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            {userRoutes.map((route,index) => (
              <Route key={`user-${index}`} {...route} />
            ))}
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
          </Routes>
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