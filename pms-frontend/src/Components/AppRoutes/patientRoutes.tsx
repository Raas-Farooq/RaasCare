import PatientProfile from '../Patient/patientDetail.tsx';
import Home from '../pages/home.tsx';
import PatientForm from '../Patient/addPatient.tsx';
import UpdatePatientProfile from '../Patient/updatePatientProfile.tsx';


export const patientRoutes = [
  { path: "/", element: <Home /> },
  { path: "/profile/:patientId", element: <PatientProfile /> },
  { path: '/addPatient', element: <PatientForm /> },
  { path: "/updatePatientProfile", element: <UpdatePatientProfile /> }
];

export default patientRoutes