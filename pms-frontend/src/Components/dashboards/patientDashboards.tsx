import { useNavigate, Outlet, ScrollRestoration } from "react-router-dom"


const PatientDashboard = () => {

    const navigate = useNavigate();
    const handlePrivilege = ()=> {
        navigate('/patient-dashboard/updatePatientProfile')
    }

    return (
        <div className="patient-dashboard">
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default PatientDashboard