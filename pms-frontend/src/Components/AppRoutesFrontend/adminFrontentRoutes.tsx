

// add Doctor, update Doctor, manage bookings, s

import AddNewDoctor from "../../features/Admin/components/addNewDoctor";
import AdminHome from "../../features/Admin/components/AdminHome";
// import UpdateDoctorPrfoile from "../../features/Admin/components/updateDoctorProfile";
// import AdminHome from "../../features/Admin/AdminHome";
// import UpdateDoctorPrfoile from "../../features/Admin/updateDoctorProfile";



const adminRoutes = [
    {index:true, element:<AdminHome />}, // Note: We use the index:true above now, so these must be subpaths
    {path:"addDoctor", element:<AddNewDoctor />},
    // ...
];



export default adminRoutes