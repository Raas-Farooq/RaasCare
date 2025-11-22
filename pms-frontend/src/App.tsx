
import './index.css';
import './App.css'

import { Outlet } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

import { useAuth } from './context/appContext';
import { AnimatePresence } from 'framer-motion';



function App() {

  const { loading } = useAuth();

  if (loading) return <h1>Loading..</h1>

  return (

    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000
        }}
      />
      <div>
        <AnimatePresence mode='wait'>
          <Outlet />
        </AnimatePresence>
      </div>
    </>
  )
}

export default App

