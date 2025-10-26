import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import parsePhoneNumberFromString from "libphonenumber-js"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useAuth } from "../../../context/appContext"
import HandleAxiosError from "../../../utils/handleAxiosError"



interface SubmitProps {
    username: string,
    email: string,
    password: string,
    phoneNum: string,
}
function Register() {
    const navigate = useNavigate();
    const [revealPassword, setRevealPassword] = useState(false);
    const [patientRecordId, setPatientRecordId] = useState('');
    const { login } = useAuth();
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
        ,
        phoneNum: z.string()
        // .min(11, 'Phone number must contains atleast 11 digits')
        // .max(12, "Phone Number digits can't exceed 12")

    })

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(registerSchema)
    })

    const submitResult = async (data: SubmitProps) => {
        console.log("Submit clicked ,", data);
        let normalizedPhone;
        if (data.phoneNum) {
            const phoneNumber = parsePhoneNumberFromString(data.phoneNum, 'PK');

            if (!phoneNumber || !phoneNumber.isValid()) {
                toast.error("Phone Number is not Valid");
                return;
            }
            if (!phoneNumber.number.startsWith('+923')) {
                toast.error("Pakistani number Must start from +923 or 03");
                return;
            }
            normalizedPhone = phoneNumber.number;
            console.log("normalized Phone number ", normalizedPhone);
        }
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const toastId = toast.loading('Signing Up. Wait..')
        try {
            const response = await axios.post(`${backendUrl}/pms/createNewUser`, {
                username: data.username,
                email: data.email,
                password: data.password,
                phone: normalizedPhone
            })

            if (response.data.success) {
                console.log("Success! respone data ", response.data);
                const patientReceived = response.data;
                login(patientReceived.user, patientReceived.jwt_token, patientReceived.expiresIn, patientReceived.userProfile, []);
                const patientRecord = patientReceived.userProfile.patientRecord;
                if (patientRecord) {
                    setPatientRecordId(patientRecord)
                }
                toast.success('You have Successfully Registered ', { id: toastId })
                navigate('/patient-dashboard')
            }

        } catch (err: string | any) {
            let errorMessage = HandleAxiosError(err);
            toast.error(errorMessage, { id: toastId });
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
                        <label htmlFor="email" className="block text-gray-600 font-medium">Email *</label>
                        <input
                            type="email"
                            id="email"
                            className={`border-b-2 rounded-none p-2 transition-colors focus:outline-none focus:border-purple-600 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            {...register('email')}
                        />
                        {errors.email && <p className="text-red-500 mt-1 text-sm"> {errors.email.message?.toString()} </p>}
                        <div className="relative">
                            <label htmlFor="password" className="block text-gray-600 font-medium"> Password *</label>
                            <input
                                type={revealPassword ? 'text' : "password"}
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
                        <label aria-label="Phone Number" className="block text-gray-600 mb-1 font-medium"> Phone Number *</label>
                        <input
                            type="text"
                            className="border-b-2 border-gray-500 w-full focus:outline-none focus:border-purple-600"
                            placeholder="03xxx/923xxx. Digits must be 11 or 12"
                            {...register('phoneNum')} />
                        {errors.phoneNum && <p className="text-red-500 mt-1 text-sm">{errors.phoneNum.message?.toString()}</p>}

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