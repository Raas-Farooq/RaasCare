import { Outlet } from "react-router-dom";





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