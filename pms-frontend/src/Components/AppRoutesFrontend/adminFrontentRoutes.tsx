

// add Doctor, update Doctor, manage bookings, s

import AddNewDoctor from "../../features/Admin/components/addNewDoctor";
import AdminHome from "../../features/Admin/components/AdminHome";
// import UpdateDoctorPrfoile from "../../features/Admin/components/updateDoctorProfile";
// import AdminHome from "../../features/Admin/AdminHome";
// import UpdateDoctorPrfoile from "../../features/Admin/updateDoctorProfile";
import AdminDashboard from "../dashboards/adminDashboard";


const adminRoutesChildren = [
    {index:true, element:<AdminHome />}, // Note: We use the index:true above now, so these must be subpaths
    {path:"addDoctor", element:<AddNewDoctor />},
    // ...
];

// Or if you kept the original structure, you just access children:
const adminRoutes = [{
    path:'/admin-dashboard', // This path won't be used in the main router now
    element:<AdminDashboard />, // This element won't be used
    children: adminRoutesChildren // This is the list we want
}]


export default adminRoutes