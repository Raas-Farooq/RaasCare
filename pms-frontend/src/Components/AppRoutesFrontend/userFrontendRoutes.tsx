import Register from "../User/RegisterLogin/register.tsx"
import Login from "../User/RegisterLogin/login.tsx"
import DoctorPublicProfile from "../../features/Doctor/doctorProfile.tsx"
import AllDoctors from "../../features/Doctor/allDoctorsList.tsx"
import TopFacilities from "../../Home/topFacilities.tsx"


const userRoutes = [
     {path:"/register", element:<Register />,public:true },
     {path:'/topFacilities', element:<TopFacilities />, public:true},
     {path:"/login", element:<Login />,public:true },
     {path:"/allDoctorsPublic", element:<AllDoctors />,public:true },
     {path:"/doctorPublicProfile/:doctorId", element:<DoctorPublicProfile />,public:true }
]
   

export default userRoutes