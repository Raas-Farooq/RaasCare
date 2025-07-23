import PatientProfile from '../../features/Patient/patientDetail.tsx';
import Home from '../Home/home.tsx';
import PatientAddForm from '../../features/Patient/addPatient.tsx';
// import UpdatePatientProfile from '../Patient/updatePatientProfile.tsx';
import PatientDashboard from '../dashboards/patientDashboards.tsx';
import UpdatePatientProfile from '../../features/Patient/updatePatientProfile.tsx';

export const patientRoutes = [{
  path:'/patient-dashboard',
  element: <PatientDashboard />,
  children:[
    { index: true, element: <Home /> },
    { path: "profile/:patientId", element: <PatientProfile /> },
    { path: 'addPatient', element: <PatientAddForm /> },
    { path: "updatePatientProfile", element: <UpdatePatientProfile /> }
  ]
}
];

console.log("patient Routes: ", patientRoutes)
export default patientRoutes

// hanger 
// software engineer
// how many rooms and people here?
