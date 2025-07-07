import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface SubmitProps{
    email:String,
    password:String
}
const Login = () => {

    const emailSchema = z.object({
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

        const {register, handleState, formState:{errors}, reset } = useForm({
            resolver:zodResolver(emailSchema)
        })

        const submitResult = (data:SubmitProps) => {
            console.log("data: of submit Result ", data);
        }
    return (
        <h1>
           <form className="flex flex-col px-2 py-4" onSubmit={handleSubmit(submitResult)}>
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
                        {isSubmitting ? "Registering..." : "Register"}
                        </button>
                    </form>
        </h1>
    )
}

export default Login