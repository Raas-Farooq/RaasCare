import { useNavigate, Outlet } from "react-router-dom"
import Navbar from "../Navbar/navbar"
// import useNavigate from 'react-router-dom';

const PatientDashboard = () => {

    const navigate = useNavigate();
    const handlePrivilege = ()=> {
        navigate('/patient-dashboard/updatePatientProfile')
    }

    return (
        <div className="patient-dashboard">
            <Navbar />

            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default PatientDashboard