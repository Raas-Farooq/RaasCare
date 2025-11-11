import { Outlet } from "react-router-dom"


const PatientDashboard = () => {


    return (
        <div className="patient-dashboard">
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default PatientDashboard