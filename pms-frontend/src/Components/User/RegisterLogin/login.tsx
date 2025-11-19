import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { z } from "zod"
import { useAuth } from "../../../context/appContext"
import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"

import HandleAxiosError from "../../../utils/handleAxiosError"

const loginSchema = z.object({
    email: z.string()
        .email('You should enter a valid Email'),
    password: z.string()
        .min(6, "password must contains atleast 8 characters")
    // .regex(/[0-9]/,'Password should contains atleast one number')
    // .regex(/[A-Z]/, 'Password should contains atleast one UpperCase letter')
    // .regex(/[!@#$%&*]/, 'Password should contains atleast one Special Case Letter')
})

const backend_url = import.meta.env.VITE_BACKEND_URL;
type SubmitProps = z.infer<typeof loginSchema>
const Login = () => {
    const { login } = useAuth()
    const navigate = useNavigate();
    // const [patientRecordId, setPatientRecordId] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema)
    })

  

    const submitResult = async (data: SubmitProps) => {
        const toastId = toast.loading('Signing In..');
        try {
            const response = await axios.post(`${backend_url}/pms/loginUser`,
                { email: data.email, password: data.password },
                {
                    withCredentials: true,
                })
            if (response.data.success) {
                toast.success("Successfully LoggedIn", { id: toastId });
                const loginResponse = response.data;
                const role = loginResponse.user.role;
                login(loginResponse.user, loginResponse.token, loginResponse.expiresIn, loginResponse.userProfile, loginResponse.slotsBooked);
                switch (role) {
                    case 'patient': {
                        // const patientId = loginResponse.userProfile.patientRecord;
                        // if(patientId){
                        //     setPatientRecordId(patientId);
                        // };
                        navigate('/patient-dashboard');
                        break;
                    }
                    case 'doctor': {
                        navigate('/doctor-dashboard');
                        break;
                    }
                    case 'admin': {
                        navigate('/admin-dashboard');
                        break;
                    }
                    default: {
                        navigate('/');
                    }
                }
            }

        } catch (err) {
           let errorMessage = HandleAxiosError(err);
            toast.error(errorMessage, { id: toastId , duration:8000});
        }
    }
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <h1 className="text-2xl md:text-3xl text-purple-700 text-center font-bold mb-6"> Login Here</h1>
            <section className="shadow-xl bg-white rounded-lg w-full max-w-md p-8 sm:p-12">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit(submitResult)}>
                    <label htmlFor="email" 
                    className="block text-gray-700 font-medium mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        className={`border-b-2 rounded-none transition-colors duration-200
                            w-full p-3 focus:outline-none focus:border-purple-500 
                
                            ${errors.email ? 'border-red-500' : 'border-gray-300'}
                            `}
                        {...register('email')}
                    />
                    {errors.email && <p className="text-red-500 mt-1 text-sm"> {errors.email.message?.toString()} </p>}
                    <div className="relative">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-1"> Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            className={
                                `border-b-2 pr-10 rounded-none transition-colors duration-200
                                w-full p-3 focus:outline-none focus:border-purple-500 
                                 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            {...register('password')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-12 -translate-y-1/2 text-gray-500"
                            aria-label={showPassword ? 'Hide Password': 'Show Password'}
                        > {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                        {errors.password && <p className="text-red-500 mt-1 text-sm"> {errors.password.message?.toString()} </p>}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                       className={`
                            w-full px-4 py-3 rounded-md font-semibold text-black
                            text-lg transition-colors duration-300
                            hover:text-white 
                            ${isSubmitting 
                                ? '!bg-gray-400 cursor-not-allowed'
                                : '!bg-purple-400 hover:!bg-purple-700 text-white'
                            }
                        `}
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>

                    <div className="flex flex-right">
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className={`w-full text-sm transition-colors duration-200 bg-purple-200 hover:text-purple-700 rounded-lg px-2 py-2 cursor-pointer appearance-none
                                ${isSubmitting && 'cursor-not-allowed bg-gray-400'}`}
                        >
                            Create Account
                        </button>
                        <button
                            type="button"
  
                            className={`w-full text-sm transition-colors duration-200 bg-purple-200 hover:text-purple-700 rounded-lg px-2 py-2 cursor-pointer appearance-none
                                ${isSubmitting && 'cursor-not-allowed bg-gray-400'}`}
                        >
                            Forget Password?
                        </button>
                    </div>
                </form>
            </section>
        </main>

    )
}

export default Login