import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from '../Navbar/navbar.tsx'
import { useEffect } from "react";
import { useAuth } from "../../context/appContext.tsx";




function DoctorDashboard(){
 
    return (
      <>
        
        <main>
          <Outlet />
        </main>
        
      </>
         
    )
}

export default DoctorDashboard