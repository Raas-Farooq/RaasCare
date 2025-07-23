import { Navigate, Outlet } from "react-router-dom"

interface ProtectedRouteProps{
    isAuthenticated:boolean,
    allowedRoles:string[],
    userRole:string,
    redirectPath:string,
    children?:React.ReactNode,

}

const ProtectedRoute = ({isAuthenticated,allowedRoles,userRole,redirectPath="/login",children}:ProtectedRouteProps) => {

    if(!isAuthenticated){
        return <Navigate to={redirectPath} replace />
    }

    if(userRole && !allowedRoles.includes(userRole)){
        return <Navigate to ={redirectPath} replace />
    }

    return children ? children: <Outlet />

}

export default ProtectedRoute