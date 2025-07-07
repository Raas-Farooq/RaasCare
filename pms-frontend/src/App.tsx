
import './index.css';
import './App.css'
import patientRoutes from './Components/AppRoutes/patientRoutes';
import userRoutes from './Components/AppRoutes/userRoutes';
import { Route, Routes } from 'react-router-dom';
  
    function App() {
      return (
        <div>
          <Routes>

            {userRoutes.map((route,index) => (
              <Route key={`user-${index}`} {...route} />
            ))}
            {patientRoutes.map((route, index) => {
              return (
                <Route key={`patient-${index}`} {...route} />
              )
            })}
          </Routes>
        </div>
      )
}

export default App

{/* <div className="bg-gray-50 min-h-screen py-10">
      <div className="bg-white shadow-md rounded:lg px-6 py-8 w-full mx-auto max-w-3xl"> */}