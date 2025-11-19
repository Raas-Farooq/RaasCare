
import './index.css';
import './App.css'

import { Outlet, useLocation } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

import { useAuth } from './context/appContext';
import { AnimatePresence } from 'framer-motion'
import Home from './Home/home';
// import PageWrapper from './pageWrapper';

function App() {

  const { loading } = useAuth();
  const location = useLocation();
  if (loading) return <h1>Loading..</h1>
  console.log("app rendered ")
  return (
    <div>
      {/* <AnimatePresence mode="wait"> */}
        <div key={location.key}>
          {/* <Home /> */}
        <Outlet />
        </div>
      {/* </AnimatePresence> */}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000
        }}
      />
    </div>
     
  )
}

export default App

