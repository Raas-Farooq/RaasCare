import { ArrowLeft, ArrowRight} from "lucide-react"
import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/appContext"
import toast from "react-hot-toast"


interface TimeSlots {
    slotTime: string,
    isBooked: boolean,
    _id?: string,
}
interface ProfileImage {
    imageUrl: string,
    public_id: string
}
interface AllDoctorInterface {
    _id: string,
    username: string,
    email: string,
    password: string,
    profileImage: ProfileImage,
    education: string,
    speciality: string,
    about: string,
    address: string,
    consultationFee: number,
    slots: TimeSlots[]
}

interface ComponentProps {
    targetField?: string
}
const DoctorsBySpeciality = ({ targetField: propField }: ComponentProps) => {
    const [displayDoctors, setDisplayDoctors] = useState<AllDoctorInterface[]>([]);
    const [updatedDisplayDoctors, setUpdatedDisplayDoctors] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const targetFieldReceived = propField ?? (location.state as { targetField?: string })?.targetField ?? 'All';

    const { allDoctors, loadingAllDoctors, caughtError} = useAuth();

    useEffect(() => {
        window.scrollTo(0,0)
    },[targetFieldReceived])

    useEffect(() => {
        setUpdatedDisplayDoctors(false);
        if (allDoctors.length === 0) return;
        const sortedDoctors =
            targetFieldReceived === 'All Doctors'
                ? allDoctors
                :
                allDoctors.filter(doctor => doctor.speciality === targetFieldReceived);
        setDisplayDoctors(sortedDoctors);
        setUpdatedDisplayDoctors(true)
    }, [allDoctors, targetFieldReceived])

    if (loadingAllDoctors || !updatedDisplayDoctors) {
        return <h1 className="text-xl text-center">Loading Doctors..</h1>
    }

    if(caughtError){
        toast.error("Error while loading all blogs");
        console.error("Error while loading all blogs", caughtError.message)
    }
    
    return (
        <>
            <h1 className="text-3xl text-center text-teal-700 font-bold mx-auto my-6 border-b border-gray-500 w-fit ">
                {(targetFieldReceived && targetFieldReceived !== 'All Doctors')
                    ?
                    targetFieldReceived + 's'
                    :
                    targetFieldReceived}
            </h1>
            <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-center">
                {displayDoctors.length > 0 &&
                    displayDoctors?.map((doctor, index) => (
                        <Link
                            key={index}
                            to={`/doctorPublicProfile/${doctor._id}`}
                            className="group block shadow-md bg-white 
                            px-4 py-8 flex-col rounded-2xl overflow-hidden hover:shadow-xl 
                            transition-all duration-300 hover:-translate-y-1"
                            >
                            <div className="flex flex-col h-full max-w-sm md:max-w-auto">
                                <div className="relative overflow-hidden">
                                    <img
                                        className="w-full sm:h-auto md:h-80 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                        src={doctor.profileImage.imageUrl}
                                        alt={`${doctor.username} Profile`}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Speciality Badge */}
                                    <div className="absolute top-4 right-4 bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                        {doctor.speciality}
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="text-center mb-3">
                                        <h2 className="font-bold text-xl text-gray-800 group-hover:text-teal-600 transition-colors duration-200">
                                            {doctor.username}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">{doctor.education}</p>
                                    </div>

                                    {/* Fee and Rating */}
                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center text-gray-700">
                                            {/* <DollarSign className="text-teal-500 mr-1" size={18} /> */}
                                            <span className="text-teal-500 mr-1">Rs</span>
                                            <span className="font-semibold">{doctor.consultationFee}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-5 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="text-center">
                                        <span className="inline-flex items-center text-sm text-teal-600 font-medium">
                                            View Profile
                                            <ArrowRight className="ml-1" size={14} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))

                }
            </div>
            {(!loadingAllDoctors && updatedDisplayDoctors) && displayDoctors.length === 0 &&
                (
                    <h1 className="text-3xl text-center"> No Doctor Found </h1>
                )}
            <div className="w-full my-10 text-center flex flex-row justify-center items-center">
                <button type="button"
                    onClick={() => navigate(-1)}
                >
                    <span className="flex text-gray-500 hover:text-gray-800 transition-all hover:scale-105 duration-300"><ArrowLeft size={25} className="" /> Back</span>
                </button>
            </div>
        </>
    )


}

export default DoctorsBySpeciality