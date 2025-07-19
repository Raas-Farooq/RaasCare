import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { z } from "zod"

 const loginSchema = z.object({
              email:z.string()
            .email('You should enter a valid Email'),
            password:z.string()
            .min(8, "password must contains atleast 8 characters")
            // .regex(/[0-9]/,'Password should contains atleast one number')
            // .regex(/[A-Z]/, 'Password should contains atleast one UpperCase letter')
            // .regex(/[!@#$%&*]/, 'Password should contains atleast one Special Case Letter')
        })

type SubmitProps=z.infer<typeof loginSchema>
const Login = () => {
        const navigate = useNavigate();
        const {register, handleSubmit, formState:{errors, isSubmitting}, reset } = useForm({
            resolver:zodResolver(loginSchema)
        })

        const submitResult = async(data:SubmitProps) => {
            console.log("data: of submit Result ", data);
            const formData = new FormData();
            formData.append('email', data.email);
            formData.append('password', data.password);
            const formValues = Object.fromEntries(formData);
            console.log("formValues: ", formValues);
            Object.entries(formData).forEach(data => {
                console.log("data of form front: ", data)
            })
            try{
                const response = await axios.post('http://localhost:2500/pms/loginUser',formData, {
                 headers:{
                    "Content-Type":"application/json"
                 }
                })
                if(response.data.success){
                    toast.success("Successfully LoggedIn");
                    setTimeout(() => navigate('/'), 1000);
                }
                console.log("frontend response of login:", response)
            }catch(err){
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
                            className="w-full bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                        Login
                        </button>
                    </form>
            </section>
        </main>
           
    )
}

export default Login