import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { z } from "zod"
import { useAuth } from "../../../context/appContext"

 const loginSchema = z.object({
              email:z.string()
            .email('You should enter a valid Email'),
            password:z.string()
            .min(6, "password must contains atleast 8 characters")
            // .regex(/[0-9]/,'Password should contains atleast one number')
            // .regex(/[A-Z]/, 'Password should contains atleast one UpperCase letter')
            // .regex(/[!@#$%&*]/, 'Password should contains atleast one Special Case Letter')
        })

const backend_url = import.meta.env.VITE_BACKEND_URL
type SubmitProps=z.infer<typeof loginSchema>
const Login = () => {
        const {login} = useAuth()
        const navigate = useNavigate();
        const {register, handleSubmit, formState:{errors, isSubmitting}, reset } = useForm({
            resolver:zodResolver(loginSchema)
        })

       
        
        const submitResult = async(data:SubmitProps) => {
              const toastId = toast.loading('Signing In..')
            try{
              
                console.log(" vite backend url: ",backend_url);
                const response = await axios.post(`${backend_url}/pms/loginUser`,
                    { email:data.email, password:data.password}, 
                    {
                    withCredentials:true,
                })
                if(response.data.success){
                    console.log("frontend response of login:", response.data);
                    toast.success("Successfully LoggedIn", {id:toastId});
                    const loginResponse = response.data;
                    const role = loginResponse.user.role; 
                    login(loginResponse.user, loginResponse.token, loginResponse.expiresIn, loginResponse.userProfile, loginResponse.slotsBooked);
                    console.log("user role after login: ", role);
                    switch(role){
                        case 'patient':{
                            navigate('/patient-dashboard');
                            break;
                        }
                        case 'doctor':{
                            navigate('/doctor-dashboard');
                            break;
                        }
                        case 'admin':{
                            navigate('/admin-dashboard');
                            break;
                        }
                        default:{
                            navigate('/');
                        }
                    }
                }
                
            }catch(err){
                toast.error("Error while logging In", {id:toastId});
                console.log("error while logging the user", err)
            }
        }
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">   
            
             <section className="shadow-lg bg-white rounded-lg w-full max-w-md">
                <h1 className="text-3xl text-purple-700 text-center"> Login Here</h1>
                <form className="h-full min-h-full px-4 py-8 flex flex-col" onSubmit={handleSubmit(submitResult)}>
                        <label htmlFor="email" className="block text-gray-500">Email</label>
                        <input
                        type="email"
                        id="email"
                        className={`border-b border-gray-500 rounded-none w-full p-2 my-2 focus:outline-none ${errors.email? 'border-red-500': 'border-gray-300'}`}
                        {...register('email')}
                        />
                        {errors.email && <p className="text-red-500 mt-1 text-sm"> {errors.email.message?.toString()} </p>}
                        <label htmlFor="password" className="block text-gray-500"> Password</label>
                        <input
                        type="password"
                        id="password"
                        className={`border-b border-gray-500 rounded-none w-full p-2 my-2 focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        {...register('password')}
                        />
                        {errors.password && <p className="text-red-500 mt-1 text-sm"> {errors.password.message?.toString()} </p>}
                         <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full hover:bg-purple-600 px-2 py-2 cursor-pointer"
                            >
                        Login
                        </button>
                    </form>
            </section>
        </main>
           
    )
}

export default Login