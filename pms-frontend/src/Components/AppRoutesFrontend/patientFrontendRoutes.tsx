import PatientProfile from '../../features/Patient/patientDetail.tsx';
import Home from '../../Home/home.tsx';
import PatientAddForm from '../../features/Patient/addPatient.tsx';
// import UpdatePatientProfile from '../Patient/updatePatientProfile.tsx';
import UpdatePatientProfile from '../../features/Patient/updatePatientProfile.tsx';
import MyAppointments from '../../features/Patient/patientAppointmentsPage.tsx';



const patientRoutes = [
    { index: true, element: <Home /> },
    { path: "patientProfile/", element: <PatientProfile /> },
    {path: 'myAppointments', element :<MyAppointments />},
    { path: 'addPatient', element: <PatientAddForm /> },
    { path: "updatePatientProfile", element: <UpdatePatientProfile /> }
  ]
// const patientRoutes = [{
//   path:'/patient-dashboard',
//   element: <PatientDashboard />,
//   children: patientRoutesChildren
// }
// ];

export default patientRoutes

// hanger 
// software engineer
// how many rooms and people here?
