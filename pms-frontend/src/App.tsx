
import './index.css';
import './App.css'
import { Outlet } from 'react-router-dom';
import { useAuth } from './context/appContext';
// import { AnimatePresence } from 'framer-motion';



function App() {

  const { loading } = useAuth();
  if (loading) return <h1>Loading..</h1>


  return (

    <>
     
      <div id="page-wrapper">       
          <Outlet />
      </div>
    </>
  )
}

export default App
