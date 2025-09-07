import { useEffect, useRef, useState } from "react";

import { ArrowLeft } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/appContext";
import useFetchApi from "./fetchRequestHook";
import ngrokRequest from "../../ngrokRequesthook";
import makeNgrokRequest from "../../ngrokRequesthook";

interface Slots {
    slotTime: string,
    isBooked?: boolean,
    isCancelled?: boolean,
    isCompleted?: boolean,
    slotId?: string
}
interface BookedSlots {
    doctorId: string,
    slotTime: string,
    isBooked: boolean,
    isCancelled?: boolean,
    source: string,
    slotDate: {
        startDate: Date,
        endDate?: Date
    },
    isCompleted?: boolean,
    patientId?: string,
    patientName: string,
    _id: string,
}
interface ReceiveAvailableSlots {
    date: string,
    slots: Slots[]
}
interface DoctorDays {
    day: string,
    slots: [string]
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
    availableDays: DoctorDays[]
}


function DoctorPublicProfile() {
    const fetchRef = useRef(false);
    const [doctorProfile, setDoctorProfile] = useState<DoctorProfileInterface | null>(null);
    const [doctorSlotsAvailable, setDoctorSlotsAvailable] = useState<ReceiveAvailableSlots[] | null>(null);
    const [daySelected, setDaySelected] = useState('');
    const [selectedSlot_id, setSelectedSlot_id] = useState('');
    const { user, userRole, bookedSlots, setBookedSlots } = useAuth();
    const navigate = useNavigate();

    const { doctorId } = useParams();
    const urlLink = 'http://localhost:2500/pms/fetchDoctorProfile';
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    
    const { fetchLoading, fetchResult, fetchError } = useFetchApi(backendUrl, doctorId || null);
    const gain = { gain: 'No pain No gain' };

    
    useEffect(() => {
        if (fetchResult) {
            setDoctorProfile(fetchResult);
        }
    },[fetchResult]);

    useEffect(() => {
        if (fetchResult) {
            setDoctorProfile(fetchResult);
        }
        if (!doctorId) {
            return;
        }
        console.log("backend url; ", backendUrl);
        const fetchDoctorProfile = async () => {
            const toastId = toast.loading('');
            try {
                console.log("docId before: ", doctorId);
                const fetchResponse = await makeNgrokRequest({url:`pms/getDoctorAvailableDays/${doctorId}`, method:'get'});
                console.log("doctor available days response; ", fetchResponse);
                if (fetchResponse.data.success) {
                    console.log('generate doctor slots Results ', fetchResponse);
                    setDoctorSlotsAvailable(fetchResponse.data.remainingSlots);
                    toast.success("loaded doctors successfully", { id: toastId })
                }
            }
            catch (err) {
                toast.error("Error while fetching Doctors", { id: toastId })
                console.error("Get Error while generating all doctors slots", err);
            }
        }
        fetchDoctorProfile()
    }, [fetchResult])

    const handleSlotSelection = (id: string, time: string) => {
        console.log("time received: ", time);
        setSelectedSlot_id(id);
    }

    const handleDaySelected = (day: string) => {
        console.log("day Selected: ", day);
        setDaySelected(day);
    }

    function syncSlots(bookedSlots: BookedSlots[] | null, newSlot: BookedSlots) {
        console.log("newSlots: ", newSlot);
        if (bookedSlots && bookedSlots.length > 0) {
            const validDateSlots = bookedSlots.map((slots: BookedSlots) => {
                return {
                    ...slots,
                    slotDate: {
                        startDate: new Date(slots.slotDate.startDate),
                        endDate: slots.slotDate.endDate ? new Date(slots.slotDate.endDate) : null
                    }
                }
            })
            const formattedSlots = [...validDateSlots, newSlot ]
            console.log("using new Techninqueee....", formattedSlots);
        } else {
            const newSlotArr = [newSlot];
            setBookedSlots(newSlotArr)
        }

    }
    const handleMakeAppointment = async () => {
        if (!userRole) {
            const loginConfirm = window.confirm("please login within seconds to Confirm your appointment");
            if (loginConfirm) {
                navigate('/login')
            }
            return;
        }
        else if (userRole !== 'patient') {
            alert("You aren't allowed to make an appointment");
            return;
        }

        else if (!selectedSlot_id) {
            alert('You must select the time slot and day to confirm booking');
            return;
        }
        let storedUser;
        try {
            const localStoredUser = localStorage.getItem('auth');
            if (localStoredUser) {
                storedUser = JSON.parse(localStoredUser);
            }
        }
        catch (err) {
            console.error("error while fetching locallay stored user ", err);
        }

        console.log("userRole ", userRole, 'selectedSlot_id ', selectedSlot_id, 'user from localStorage', storedUser);

        try {
            const response = await axios.post(`${backendUrl}/pms/bookSlot/${selectedSlot_id}`,
                {
                    docId: doctorId,
                    patientId: storedUser.user.id,
                    patientName: storedUser.user.username

                },
                {
                    withCredentials: true
                }
            )
            console.log("response of appointment booking ", response)
            if (response.data.success) {
                const newSlot = response.data.slot;
                if (Object.keys(newSlot).length > 0) {
                    syncSlots(bookedSlots, newSlot);
                }

                console.log("Success")
            }
        }
        catch (err) {
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

    if (fetchLoading) return <h2> Loading..</h2>
    if (fetchError) console.error('error while fetching the doctor profile: ', fetchError);
    // if(Object.keys(fetchResult).length ){
    //     alert('Got fetchResult')
    //     console.log("Fetch result " ,fetchResult);
    // }
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
                                        {doctorSlotsAvailable && <p>available Slots : {doctorSlotsAvailable.length} </p>}
                                        <button onClick={() => handleDaySelected(slot.day)}
                                            key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-blue-200 shadow-sm ring-2 focus:ring-2 focus:ring-green-500 focus:bg-blue-200">
                                            <span className="hover:bg-blue-200">
                                                {slot.day}
                                            </span>
                                        </button>

                                    </div>
                                </>
                            ))}
                            {doctorSlotsAvailable?.map((day, index) => (
                                <div key={index} className="flex flex-col">
                                    <div className="">
                                        <button
                                            key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-blue-200 shadow-sm ring-2 focus:ring-2 focus:ring-green-500 focus:bg-blue-200">
                                            <span className="hover:bg-blue-200">
                                                {day.date.split('T')}
                                            </span>
                                        </button>
                                        {day.slots?.map(slot => (
                                            <>
                                                <button onClick={() => handleSlotSelection(slot.slotId as string, slot.slotTime)}
                                                    className="py-2 px-4 !bg-blue-100 rounded-3xl shadow:md hover:shadow-lg hover:!bg-blue-300">
                                                    {slot.slotTime}
                                                </button>
                                            </>
                                        ))}
                                    </div>

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

//  {doctorSlotsAvailable?.map((slot, index) => (
//     <div className="flex">
//         {index < slot?.slots?.length && (
//             <button key={index} onClick={() => handleSlotSelection(slot.slots[index].slotId, slot.slots[index].slotTime)}
//                 className="py-2 px-4 !bg-blue-100 rounded-3xl shadow:md hover:shadow-lg hover:!bg-blue-300">
//                 {slot.slots[index].slotTime}
//             </button>
//         )}
//     </div>
// ))}

//                             interface Slots {
//     slotTime: string,
//     isBooked?: boolean,
//     isCancelled?: boolean,
//     isCompleted?: boolean,
//     slotId?: string
// }
// interface ReceiveAvailableSlots{
//     date:string,
//     slots:Slots[]
// }
// getting error of 'Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
//   Type 'undefined' is not assignable to type 'string' on slotId 
//   then i did 'handleSlotSelection(slot.slots[index].slotId as string' and the error goes away. is it good way to debug these errors?