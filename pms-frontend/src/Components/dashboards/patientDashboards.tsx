import { useNavigate, Outlet } from "react-router-dom"
import Navbar from "../Navbar/navbar"
// import useNavigate from 'react-router-dom';

const PatientDashboard = () => {

    const navigate = useNavigate();
    const handlePrivilege = ()=> {
        navigate('/patient-dashboard/updatePatientProfile')
    }

    return (
        <>
            <Navbar />
            <h1 className="text-3xl text-blue-600 border-b border-purple-500 text-center border-inline-width">YOU CAN DO IT!</h1>
            <button 
            onClick={handlePrivilege}
            className="border border-gray-300 p-2 rounded-lg bg-green-400 hover:bg-green-500"> Privilege </button>
            <Outlet />
        </>
    )
}

export default PatientDashboard