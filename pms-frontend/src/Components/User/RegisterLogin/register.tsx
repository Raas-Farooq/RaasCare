import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"


interface SubmitProps{
    username:string,
    email:string,
    password:string,
    isPatient:boolean
}
function Register(){
    const navigate = useNavigate();
    const registerSchema = z.object({
        username:z.string()
        .min(2, 'Username must not be less than 2 characters')
        .max(50, 'Username should not be greater than 50 characters'),
        email:z.string()
        .email('You should enter a valid Email'),
        password:z.string()
        .min(8, "password must contains atleast 8 characters")
        // .regex(/[0-9]/,'Password should contains atleast one number')
        // .regex(/[A-Z]/, 'Password should contains atleast one UpperCase letter')
        // .regex(/[!@#$%&*]/, 'Password should contains atleast one Special Case Letter')
        ,
        isPatient: z.boolean({required_error:"please select an option"})
    })

    const {register, handleSubmit, formState:{errors, isSubmitting}, reset} = useForm({
        resolver:zodResolver(registerSchema)
    })


    const submitResult = async (data:SubmitProps) => {
        
        try{

            const response = await axios.post('http://localhost:2500/pms/createNewUser', {
                username:data.username,
                email:data.email,
                password:data.password,
                isPatient:data.isPatient
            })

            if(response.data.success){
                navigate('/')
            }
                    
        }catch(err){
            console.error("error while registering user and sending Post request ", err)
        }
    }

    return (
        <div>
            
            <main className="flex justify-center items-center shadow-lg min-h-screen bg-gray-50">
                <section className="bg-white shadow-md w-full max-w-lg p-8 ">
                    <header className="text-3xl text-purple-700 space-y-5">
                       <h1>
                            Become Part of Healing Family
                       </h1>
                    </header>
                
                    <form className="flex flex-col px-2 py-4" onSubmit={handleSubmit(submitResult)}>
                        <label htmlFor="username" className="block text-gray-500"> UserName</label>
                        <input 
                        type="text" 
                        id="username" 
                       className={`w-full p-2 border-b border-gray-500 p-2 my-2 focus:outline-none ${
                        errors.username ? "border-red-500" : "border-gray-300"
                        }`}
                        {...register('username')} 
                        />
                        {errors.username && <p className="text-red-500 mt-1 text-sm "> {errors.username.message?.toString()} </p>}
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
                        <div className="flex space-x-4">  
                        <label>
                            <input
                            type="checkbox"

                            {...register('isPatient')}
                            />
                            Are You Patient?
                        </label>
                        </div>
                        {errors.isPatient && (
                        <p className="text-red-500 mt-1 text-sm">{errors.isPatient.message}</p>
                        )}
                         <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                        {isSubmitting ? "Registering..." : "Register"}
                        </button>
                    </form>
                </section>
            </main>
        </div>
    )
}

export default Register