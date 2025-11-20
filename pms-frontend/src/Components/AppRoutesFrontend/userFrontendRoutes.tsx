import Register from "../User/RegisterLogin/register.tsx"
import Login from "../User/RegisterLogin/login.tsx"
import DoctorPublicProfile from "../../features/Doctor/doctorProfile.tsx"
import TopFacilities from "../../Home/topFacilities.tsx"
import DoctorsBySpeciality from "../../features/Doctor/DoctorsBySpeciality.tsx"
import MakeAppointment from "../../features/Doctor/makeAppointment.tsx"
import NursingCare from "../../Home/services/nursingCare.tsx"
import OurDoctors from "../../Home/services/ourDoctors.tsx"
import DiagnosticCenter from "../../Home/services/diagnosticCenter.tsx"
import PortfolioSite from "../../Home/services/portfolio.tsx"
import Home from "../../Home/home.tsx"

// interface AppRoute extends Omit<RouteObject, 'element'> {
//   element: ReactNode;
//   public?: boolean;

// }



const userRoutes = [
     {path:'/', element:<Home />, index:true},
     {path:"/register", element:<Register />,public:true },
     {path:'/topFacilities', element:<TopFacilities />, public:true},
     {path:"/login", element:<Login />,public:true },
     {path:"/MakeAppointment", element:<MakeAppointment />,public:true },
     {path:"/doctorPublicProfile/:doctorId", element:<DoctorPublicProfile />,public:true },
     {path:'/doctorsBySpeciality', element:<DoctorsBySpeciality />, public:true},
     {path:'/nursingCare', element:<NursingCare />, public:true},
     {path:'/ourDoctors', element:<OurDoctors />, public:true},
     {path:'/diagnosticCenter', element:<DiagnosticCenter />, public:true},
     {path:'/portfolioPage', element:<PortfolioSite />, public:true}
]
   

export default userRoutes