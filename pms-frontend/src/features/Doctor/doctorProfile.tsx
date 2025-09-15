import { useEffect, useRef, useState } from "react";

import { ArrowLeft } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/appContext";
import useFetchApi from "./fetchRequestHook";
import ngrokRequest from "../../ngrokRequesthook";
import makeNgrokRequest from "../../ngrokRequesthook";
import { FaSpinner } from "react-icons/fa";

interface Slots {
    slotTime: string,
    slotId: string
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
interface AllAvailableSlots {
    _id: string,
    date: Date,
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
    const [revealSlots, setRevealSlots] = useState(false);
    const [dayIndex, setDayIndex] = useState<number | null>(0);
    const [doctorProfile, setDoctorProfile] = useState<DoctorProfileInterface | null>(null);
    const [doctorSlotsAvailable, setDoctorSlotsAvailable] = useState<AllAvailableSlots[] | null>(null);
    const [daySelected, setDaySelected] = useState('');
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [selectedSlot_id, setSelectedSlot_id] = useState('');
    const { user, userRole, bookedSlots, setBookedSlots } = useAuth();
    const navigate = useNavigate();

    const { doctorId } = useParams();
    const urlLink = 'http://localhost:2500/pms/fetchDoctorProfile';
    const backendUrl = import.meta.env.VITE_BACKEND_URL


    // const { fetchLoading, fetchResult, fetchError } = useFetchApi(backendUrl, doctorId || null);
    const gain = { gain: 'No pain No gain' };

    useEffect(() => {
        console.log("Day index of clicked day", dayIndex);
    }, [dayIndex]);

    useEffect(() => {
        // if (fetchResult) {
        //     setDoctorProfile(fetchResult);
        // }
        if (!doctorId) {
            return;
        }

        function updateDateFormat(slotsReceived: AllAvailableSlots[]) {
            const updatedSlots = slotsReceived.map(slots => {
                return {
                    ...slots,
                    date: new Date(slots.date)
                }
            })
            console.log(" updated slots date format ", updatedSlots);
            setDoctorSlotsAvailable(updatedSlots);
        }
        console.log("backend url; ", backendUrl);
        const fetchDoctorProfile = async () => {
            const fetchDoctorProfile = makeNgrokRequest({url:`pms/fetchDoctorProfile/${doctorId}`, method:'get'});
            const fetchdoctorAvailableDays = makeNgrokRequest({url:`pms/getDoctorAvailableDays/${doctorId}`, method:'get'});
            // const toastId = toast.loading('Fetching Doctor Profile special');
            await toast.promise(Promise.all([fetchDoctorProfile, fetchdoctorAvailableDays]), {
                'loading':'Loading Doctor Profile ',
                'success':'Successfully loaded doctor Profile',
                'error':"Error while fetching Doctor Profile"
            })
            setSlotsLoading(true);
            try {
                console.log("docId before: ", doctorId);
                const [profileResponse, availableSlotsResponse] = await Promise.allSettled([fetchDoctorProfile, fetchdoctorAvailableDays]);
                if(profileResponse.status === 'fulfilled' && profileResponse.value.data.success){
                      console.log(" profile Response: ", profileResponse);
                      const docProfile = profileResponse.value.data.doctorProfile;
                      setDoctorProfile(docProfile)
                     
                }else{
                    // toast.error(" Failed to load Doctor Profile ", {id:toastId});
                }
                if(availableSlotsResponse.status === 'fulfilled' && availableSlotsResponse.value.data.success){
                    const remainingSlots = availableSlotsResponse.value.data.remainingSlots;
                    if (remainingSlots.length) {
                        updateDateFormat(remainingSlots);
                    }
                    
                }else{
                    // toast.error(" Failed to load Doctor Profile ", {id:toastId});
                    console.error("error while fetching available days of doctor ")
                }
            //    toast.success('Loaded Profile Successfully ', {id:toastId})
            }
            catch (err) {
                // toast.error("Error while fetching Doctor Profile", {id:toastId});
                console.error("Get Error while generating all doctors slots", err);
            } finally {
                setSlotsLoading(false)
            }
        }
        fetchDoctorProfile()
    }, [doctorId])

    const handleSlotSelection = (id: string, time: string) => {
        console.log("time received: ", time);
        setSelectedSlot_id(id);
    }

    const handleDayIndex = (index: number) => {
        console.log("Index: ", typeof(index), "dayIndex: ", typeof(dayIndex));
        if(index === dayIndex){
            setDayIndex(null);
        }else{
            console.log("Inside the elese ", index);
            setDayIndex(index);
        }
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
            const formattedSlots = [...validDateSlots, newSlot]
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

    // if (fetchLoading) return <h2> Loading..</h2>
    // if (fetchError) console.error('error while fetching the doctor profile: ', fetchError);
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

                            {slotsLoading && <FaSpinner className="animate-spin " />}
                            {(!slotsLoading && doctorSlotsAvailable?.length) ? doctorSlotsAvailable.map((day, index) => (
                                    <div>
                                        <button
                                            onClick={() => { setRevealSlots(!revealSlots), handleDayIndex(index)}}
                                            key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-blue-200 shadow-sm ring-2 focus:ring-2 focus:ring-green-500 focus:bg-blue-200">
                                            <span className="hover:bg-blue-200">
                                                {day.date.toLocaleDateString('en-Us', { weekday: 'short', day: "numeric" })}
                                            </span>
                                        </button>
                                        <div className="w-full flex max-w-xl">
                                            {dayIndex === index && day.slots?.map((slot,slotIndex) => (
                                                <button key={slotIndex} onClick={() => handleSlotSelection(slot.slotId, slot.slotTime)}
                                                    className={`m-3 text-xs py-2 w-24 !bg-blue-100 rounded-xl shadow:full hover:shadow-lg hover:!bg-blue-300 ${dayIndex === index ? 'bg-blue-200 focus:bg-blue-200' : 'hover:bg-blue-100'}`}>
                                                    {slot.slotTime}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                            )) :
                                <h2 className="text-yellow-500">Slots Not Found </h2>
                            }
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