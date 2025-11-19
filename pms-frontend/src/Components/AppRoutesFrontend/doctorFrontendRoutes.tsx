import DoctorHome from "../../features/Doctor/doctorHome";
import PatientAddForm from "../../features/Patient/addPatient";
import PatientProfile from "../../features/Patient/patientDetail";
import UpdatePatientProfile from "../../features/Patient/updatePatientProfile";
import DoctorDashboard from "../dashboards/doctorDashboard";


const doctorRoutesChildren =[
        {index:true, element:<DoctorHome />},
        {path:'addPatient', element:<PatientAddForm /> },
        {path:'updatePatientProfile', element:<UpdatePatientProfile /> },
        { path: "profile/:patientId", element: <PatientProfile /> },
    ]


const doctorRoutes = [{
    path:'/doctor-dashboard',
    element:<DoctorDashboard />, 
    children:doctorRoutesChildren
    }
]

export default doctorRoutes;