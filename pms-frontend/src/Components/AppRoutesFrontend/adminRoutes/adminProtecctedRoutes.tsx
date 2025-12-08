import ProtectedRoute from "../../protectRoutes/protectedRoute";
import AdminLayout from "./adminLayout";


export default function AdminProtectedRoutes(){

    return(
        <ProtectedRoute allowedRoles={['admin']} redirectPath={'/login'} >
            <AdminLayout />
        </ProtectedRoute>
    )
}