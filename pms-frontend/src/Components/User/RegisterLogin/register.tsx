import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { z } from "zod"


interface SubmitProps {
    username: string,
    email: string,
    password: string,
}
function Register() {
    const navigate = useNavigate();
    const [revealPassword, setRevealPassword] = useState(false);
    const registerSchema = z.object({
        username: z.string()
            .min(2, 'Username must not be less than 2 characters')
            .max(50, 'Username should not be greater than 50 characters'),
        email: z.string()
            .email('You should enter a valid Email'),
        password: z.string()
            .min(8, "password must contains atleast 8 characters")
        // .regex(/[0-9]/,'Password should contains atleast one number')
        // .regex(/[A-Z]/, 'Password should contains atleast one UpperCase letter')
        // .regex(/[!@#$%&*]/, 'Password should contains atleast one Special Case Letter')
        
    })

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(registerSchema)
    })

    function handleRegister(){
        console.log(" can you handle the Register ", )
    }
    const submitResult = async (data: SubmitProps) => {
        console.log("Submit clicked ,",data)
        const toastId = toast.loading('Signing Up. Wait..')
        try {
            const response = await axios.post('http://localhost:2500/pms/createNewUser', {
                username: data.username,
                email: data.email,
                password: data.password,
            })

            if (response.data.success) {
                toast.success('You have Successfully Registered ', { id: toastId })
                navigate('/')
            }

        } catch (err) {
            toast.error('Error while Signing Up. Try Again later', { id: toastId })
            console.error("error while registering user and sending Post request ", err)
        }
    }

    return (
        <div>

            <main className="flex justify-center items-center shadow-lg min-h-screen bg-gray-50">
                <section className="w-full max-w-lg p-8 ">
                    <header className="text-2xl md:text-3xl text-purple-700 text-center mb-8 font-bold">
                        <h1>
                            Become Part of Healing Family
                        </h1>
                    </header>

                    <form className="flex flex-col px-12 py-12 bg-white shadow-xl space-y-5 rounded-md" onSubmit={handleSubmit(submitResult, errors => console.log(" errors inside form inputs ", errors))}>
                        <label htmlFor="username" className="block text-gray-600 font-medium"> User Name</label>
                        <input
                            type="text"
                            id="username"
                            className={`border-b-2 rounded-none p-2 transition-colors duration-200 focus:outline-none focus:border-purple-600 ${errors.username ? "border-red-500" : "border-gray-300"
                                }`}
                            {...register('username')}
                        />
                        {errors.username && <p className="text-red-500 mt-1 text-sm "> {errors.username.message?.toString()} </p>}
                        <label htmlFor="email" className="block text-gray-600 font-medium">Email</label>
                        <input
                            type="email"
                            id="email"
                            className={`border-b-2 rounded-none p-2 transition-colors focus:outline-none focus:border-purple-600 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            {...register('email')}
                        />
                        {errors.email && <p className="text-red-500 mt-1 text-sm"> {errors.email.message?.toString()} </p>}
                        <div className="relative">
                                <label htmlFor="password" className="block text-gray-600 font-medium"> Password</label>
                            <input
                                type={ revealPassword ? 'text' : "password"}
                                id="password"
                                className={`w-full border-b-2 rounded-none transition-colors p-2 focus:outline-none focus:border-purple-600 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                {...register('password')}
                            />
                            
                            {errors.password && <p className="text-red-500 mt-1 text-sm"> {errors.password.message?.toString()} </p>}
                            <div className="absolute bottom-3 right-8">
                                <button
                                    aria-label={revealPassword ? "Hide Password" : " Reveal Password "}
                                    type="button"
                                    onClick={() => setRevealPassword(!revealPassword)}>
                                    {revealPassword ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full font-bold !bg-purple-300 transition-colors duration-300 text-white py-4 px-4 rounded-md hover:!bg-purple-800 
                             disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Registering..." : "Register"}

                        </button>
                        <div className="flex gap-2">
                            <p>Already Have Account?</p>
                            <button 
                            type="button"
                            aria-label="login"
                            onClick={() => navigate('/login')}
                            className="text-gray-500 hover:text-purple-700 hover:underline"> 
                            Login Here
                            </button>
                        </div>
                        
                    </form>
                </section>
            </main>
        </div>
    )
}

export default Register