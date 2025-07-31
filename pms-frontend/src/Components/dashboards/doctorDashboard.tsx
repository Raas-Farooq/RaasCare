import { Outlet } from "react-router-dom";
import Navbar from '../Navbar/navbar.tsx'




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