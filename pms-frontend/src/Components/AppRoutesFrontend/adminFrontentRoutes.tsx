

// add Doctor, update Doctor, manage bookings, s

import AdminDashboard from "../dashboards/adminDashboard";



const adminRoutes = [{
    path:'/admin',
    element:<AdminDashboard />,
    children:[{
        // index:true, element:<AdminHome />,
        // path:"addDoctor" element:<AddDoctor />,
        // path:"updateDoctor" element:<UpdateDoctor />,
        // path:'manageBookings' element:<ManageBookings />
    }]
}]

export default adminRoutes