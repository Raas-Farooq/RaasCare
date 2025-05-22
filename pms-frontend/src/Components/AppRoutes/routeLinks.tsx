import {Route, Routes} from 'react-router-dom';

import PatientProfile from '../pages/patientDetail.tsx';
import Home from '../pages/home.tsx';

const RouteLinks = () => {
    return(
      
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile/:patientId" element={<PatientProfile />} />
                </Routes>
            </div>
        
    )
}

export default RouteLinks