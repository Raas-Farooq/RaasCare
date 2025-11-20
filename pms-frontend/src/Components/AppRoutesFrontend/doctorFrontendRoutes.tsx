import DoctorHome from "../../features/Doctor/doctorHome";
import PatientAddForm from "../../features/Patient/addPatient";
import PatientProfile from "../../features/Patient/patientDetail";
import UpdatePatientProfile from "../../features/Patient/updatePatientProfile";



const doctorRoutes =[
        {index:true, element:<DoctorHome />},
        {path:'addPatient', element:<PatientAddForm /> },
        {path:'updatePatientProfile', element:<UpdatePatientProfile /> },
        { path: "profile/:patientId", element: <PatientProfile /> },
    ]



export default doctorRoutes;