import { useEffect, useRef, useState } from "react";

import { ArrowLeft } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/appContext";

interface Slots {
    slotTime: string,
    isBooked: boolean,
    isCancelled: boolean,
    isCompleted: boolean,
    _id?: string
}
interface AvailableDays {
    day: string,
    slots: Slots[]
}
interface ProfileImage {
    imageUrl: string,
    public_id: string
}
interface DoctorProfileInterface {
    _id: string,
    username: string,
    email: string,
    password: string,
    profileImage: ProfileImage,
    education: string,
    available: boolean,
    experience: number,
    speciality: string,
    about: string,
    address: string,
    consultationFee: number,
    availableDays: AvailableDays[]
}

function DoctorPublicProfile() {
    const fetchRef = useRef(false);
    const [doctorProfile, setDoctorProfile] = useState<DoctorProfileInterface | null>(null);
    const [daySelected, setDaySelected] = useState('');
    const [timeSelected, setTimeSelected] = useState('');
    const {user, userRole} = useAuth();
    const navigate = useNavigate();

    const { doctorId } = useParams();
    useEffect(() => {
        if (fetchRef.current) return;
        fetchRef.current = true;
        const fetchDoctorProfile = async () => {
            const toastId = toast.loading('Loading Doctors');
            try {
                const fetchResponse = await axios.get(`http://localhost:2500/pms/fetchDoctorProfile/${doctorId}`);
                if (fetchResponse.data.success) {
                    console.log('doctors fetchResponse ', fetchResponse);
                    setDoctorProfile(fetchResponse.data.doctorProfile);
                    toast.success("loaded doctors successfully", { id: toastId })
                }
            }
            catch (err) {
                toast.error("Error while fetching Doctors", { id: toastId })
                console.error("Get Error while fetching all doctors", err);
            }
        }
        fetchDoctorProfile()
    }, [doctorId])

    const handleSlotSelection = (time:string) => {
        console.log("time received: ", time);
        setTimeSelected(time);
    }

    const handleDaySelected = (day:string) => {
        console.log("day Selected: ", day);
        setDaySelected(day);
    }

    const handleMakeAppointment = async() => {
        if(!userRole){
            const loginConfirm = window.confirm("please login within seconds to Confirm your appointment");
            if(loginConfirm){
                navigate('/login')
            }
            return;
        }
        else if(userRole !== 'patient'){
            alert("You aren't allowed to make an appointment");
            return;
        }
        
        else if(!timeSelected || !daySelected){
            alert('You must select the time slot and day to confirm booking');
            return;
        }
        let storedUser;
        try{
            const localStoredUser = localStorage.getItem('auth');
            if(localStoredUser){
                storedUser = JSON.parse(localStoredUser);
            }
        }
        catch(err){
            console.error("error while fetching locallay stored user ", err);
        }
        
        console.log("userRole ", userRole, 'timeSelected ',timeSelected, ' daySelected ', daySelected, 'user from localStorage', storedUser.user.username);

        try{
            const response = await axios.post(`http://localhost:2500/pms/bookAppointment/${user?.id}`,
                {
                    docId: doctorId,
                    selectedDay: daySelected,
                    selectedTime: timeSelected,
                    patientName:storedUser.user.username
                    
                },
                {
                    withCredentials:true
                }
            )
            console.log("response of appointment booking ", response)
            if(response.data.success){
                console.log("Success")
            }
        }
        catch(err){
            console.error('Got Error :', err);
        }
    }

    if (!doctorProfile) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-800">Doctor not found</h2>
                    <Link to="/doctors" className="text-blue-500 hover:underline mt-4 inline-block">
                        Back to Doctors List
                    </Link>
                </div>
            </div>
        );
    }

    return (

        <main className="container mx-auto px-4 py-8">
            <section className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                    <img
                        src={doctorProfile.profileImage.imageUrl}
                        alt={`Dr. ${doctorProfile.username}`}
                        className="object-cover rounded-lg w-full max-w-xs shadow-md h-auto" />
                </div>

                <div className="flex-grow">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Dr. {doctorProfile.username}</h1>
                    <p className="text-gray-600 mb-6">{doctorProfile.about}</p>

                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-blue-100 rounded-full text-sm text-blue-700">
                            {doctorProfile.education}
                        </span>
                        <span className="px-3 py-1 bg-green-100 rounded-full text-sm text-green-700">
                            {doctorProfile.speciality}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 rounded-full text-sm text-purple-700">
                            {doctorProfile.experience} years experience
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-2">Contact Information</h3>
                            <p className="text-gray-600">Email: {doctorProfile.email}</p>
                            <p className="text-gray-600">Address: {doctorProfile.address}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-2">Consultation Fee</h3>
                            <p className="text-2xl font-bold text-blue-600">Rs {doctorProfile.consultationFee}</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Slots</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {doctorProfile.availableDays?.map((slot, index) => (
                                <>
                                    <div key={index}>
                                        <button onClick={() => handleDaySelected(slot.day)} 
                                        key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-blue-200 shadow-sm ring-2 focus:ring-2 focus:ring-green-500 focus:bg-blue-200">
                                            <span className="hover:bg-blue-200">
                                                {slot.day}
                                            </span>
                                        </button>
                                    </div>
                                </>
                            ))}
                             {doctorProfile.availableDays?.map((slot, index) => (
                             <div className="flex">
                                        {index < slot.slots.length && (
                                            <button key={index} onClick={() => handleSlotSelection(slot.slots[index].slotTime)}
                                                className="py-2 px-4 !bg-blue-100 rounded-3xl shadow:md hover:shadow-lg hover:!bg-blue-300">
                                                {slot.slots[index].slotTime}
                                            </button>
                                        )}
                                    </div>
                             ))}
                        </div>
                    </div>
                    <div className="mb-4"
                    onClick={handleMakeAppointment}>

                        <button className="bg-purple-400 rounded-full px-2 py-3 hover:shadow-md hover:bg-purple-500"> Make Appointment</button>
                    </div>
                    <Link
                        to="/allDoctorsPublic"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                        <ArrowLeft size={20} />
                        Back to Doctors List
                    </Link>
                </div>
            </section>
        </main>

    )
}

export default DoctorPublicProfile