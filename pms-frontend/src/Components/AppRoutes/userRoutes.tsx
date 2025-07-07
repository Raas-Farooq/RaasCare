import Register from "../User/RegisterLogin/register.tsx"
import Login from "../User/RegisterLogin/login.tsx"


const userRoutes = [
     {path:"/register", element:<Register /> },
     {path:"/login", element:<Login /> }
]
   

export default userRoutes