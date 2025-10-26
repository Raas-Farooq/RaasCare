

// add Doctor, update Doctor, manage bookings, s

import AddNewDoctor from "../../features/Admin/addNewDoctor";
import AdminHome from "../../features/Admin/AdminHome";
import UpdateDoctorPrfoile from "../../features/Admin/updateDoctorProfile";
import AdminDashboard from "../dashboards/adminDashboard";


const adminRoutes = [{
    path:'/admin-dashboard',
    element:<AdminDashboard />,
    children:[
        {index:true, element:<AdminHome />},
        {path:"addDoctor", element:<AddNewDoctor />},
        {path:"updateDoctor", element:<UpdateDoctorPrfoile />},
    ]
}]

export default adminRoutes