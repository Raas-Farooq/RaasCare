import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../context/appContext";


interface ProtectedRouteProps{

    allowedRoles:string[],
    redirectPath:string,
    children?:React.ReactNode,

}

const ProtectedRoute = ({allowedRoles,redirectPath="/login"}:ProtectedRouteProps) => {
    const {isAuthenticated, userRole, loading} = useAuth();

    if(loading) return <div>Loading..</div>
    if(!isAuthenticated){
        return <Navigate to={redirectPath} replace />
    }

    if(userRole && !allowedRoles.includes(userRole)){
        return <Navigate to ={redirectPath} replace />
    }

    return <Outlet />

}

export default ProtectedRoute