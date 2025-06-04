import {Route, Routes} from 'react-router-dom';

import PatientProfile from '../pages/patientDetail.tsx';
import Home from '../pages/home.tsx';
import PatientForm from '../pages/addPatient.tsx';

const RouteLinks = () => {
    return(
      
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile/:patientId" element={<PatientProfile />} />
                    <Route path='/addPatient' element={<PatientForm />} />
                </Routes>
            </div>
        
    )
}

export default RouteLinks