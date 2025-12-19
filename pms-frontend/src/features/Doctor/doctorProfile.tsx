import { useEffect, useRef, useState} from "react";
import './cssTransition.css';
// import { ArrowLeft } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {toast} from "sonner";
import axios from "axios";
import { useAuth } from "../../context/appContext";
import { FaSpinner } from "react-icons/fa";
import useConfirmNavigation from "../../utils/customLogin";
import HandleAxiosError from "../../utils/handleAxiosError";
import makeRequest from "../../makeRequesthook";
import { errorToast, successToast, warningToast } from "../../utils/toastStyle";
import type { BookedSlotsType } from "../../utils/globalTypes";


type Status = "available" | "booked" | "completed" | "cancelled"

interface Slots {
    slotTime: string,
    slotId: string,
    status: Status,
    isArchived:boolean
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
    const [dayId, setDayId] = useState<string | null>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProfileLoading, setIsProfileLoading] = useState<boolean | true>(true);
    const [doctorProfile, setDoctorProfile] = useState<DoctorProfileInterface | null>(null);
    const [doctorSlotsAvailable, setDoctorSlotsAvailable] = useState<AllAvailableSlots[]>([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [localStoredDoctorId, setLocalStoredDoctorId] = useState('');
    const [selectedSlot_id, setSelectedSlot_id] = useState('');
    const { userRole, bookedSlots, setBookedSlots } = useAuth();
    const navigate = useNavigate();
    const effectLoaded = useRef(false);
    const { doctorId:doctorParamsId } = useParams();

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const confirmLogin = useConfirmNavigation();

    const { allDoctors } = useAuth();

        function updateDateFormat(slotsReceived: AllAvailableSlots[]) {
        const updatedSlots = slotsReceived.map(slots => {
            return {
                ...slots,
                date: new Date(slots.date)
            }
        })
        setDayId(updatedSlots[0]._id);
        setDoctorSlotsAvailable(updatedSlots);
        setSlotsLoading(false);
    }

    useEffect(() => {
        window.scrollTo({top:0, behavior:"instant" as ScrollBehavior})
    }, [doctorParamsId])


    useEffect(() => {
        setIsProfileLoading(true);
        const currentDoctorId = doctorParamsId || localStorage.getItem('doctorId');
        if (!currentDoctorId || allDoctors.length === 0) {
            return;
        }
        localStorage.setItem("doctorId", currentDoctorId);
        setLocalStoredDoctorId(currentDoctorId);
        effectLoaded.current = true;

        const fetchDoctorProfile = async () => {
            setSlotsLoading(true);
            // const toastId = toast.loading("Loading Doctor Profile..")

            try {
                const fetchdoctorAvailableDays = await makeRequest({ url: `pms/getDoctorAvailableDays/${currentDoctorId}`, method: 'get' });
                if (fetchdoctorAvailableDays.data.success) {
                    const remainingSlots = fetchdoctorAvailableDays.data.remainingSlots;
                    console.log("remaining Slots: ", remainingSlots);
                    updateDateFormat(remainingSlots);
                    // async function detectSlotsDuplication() {
                    //       const fetchSlots = await axios.get(`${backendUrl}/pms/getDoctorSlots/693ce46789386e011f48a7db`);
                    //       if (fetchSlots.data.success) {
                    //         const mySlots= fetchSlots.data.updatedSlots;
                    //         const allTimes = mySlots.map((slot:any) => (
                    //           slot.slotTime
                    //         ))
                    //         console.log("time slots ", allTimes)
                    //       } else {
                    //         console.log("not able to fetch the slots: respone ", fetchSlots);
                    //       }
                    //     }
                        // detectSlotsDuplication();
                }

            }
            catch (err) {
                console.error("Get Error while generating all doctors slots", err);
            } finally {
                setSlotsLoading(false)
            }
        }
        if(allDoctors.length > 0){
            const filteredDoctor = allDoctors.find(doctor => doctor._id === currentDoctorId);
            if(filteredDoctor){
                setDoctorProfile(filteredDoctor);
                fetchDoctorProfile();
                setIsProfileLoading(false);
            }
            else{
                console.error("Doctor not Found")
            }
        }

    }, [doctorParamsId, allDoctors])

    const handleSlotSelection = (id: string, status:Status) => {
        
        if(status !== 'available'){
            toast.warning('This slot is not available, Please select another one');
            setSelectedSlot_id('')
        }
        if(status === 'available'){
            setSelectedSlot_id(id);
        }
    
    }

    const handleDayId = (id: string) => {
        if (selectedSlot_id) {
            setSelectedSlot_id('')
        }
        setDayId(id);


    }

    function updateSingleSlotDate(slot:BookedSlotsType){
        const updateNewSlot = {
                ...slot,
                slotDate:{
                    startDate:new Date(slot.slotDate.startDate),
                    endDate: slot.slotDate.endDate ? new Date(slot.slotDate.endDate) : undefined
                }
            }
        return updateNewSlot;
    }

    function syncSlots(bookedSlots: BookedSlotsType[] | null, newSlot: BookedSlotsType) {
        if (bookedSlots && bookedSlots.length > 0) {   
            const validDateSlots = bookedSlots.map((slots: BookedSlotsType) => {
                return {
                    ...slots,
                    slotDate: {
                        startDate: new Date(slots.slotDate.startDate),
                        endDate: slots.slotDate.endDate ? new Date(slots.slotDate.endDate) : undefined
                    }
                }
            })
            const updateSingleSlot = updateSingleSlotDate(newSlot);
            const formattedSlots = [...validDateSlots, updateSingleSlot];
            setBookedSlots(formattedSlots);
            localStorage.setItem("bookedSlots", JSON.stringify(formattedSlots));
        } else {
            const updateSingleSlot = updateSingleSlotDate(newSlot);
            const newSlotArr = [updateSingleSlot];
            localStorage.setItem("bookedSlots", JSON.stringify(newSlotArr));
            setBookedSlots(newSlotArr)
        }

    }

    
    const handleMakeAppointment = async () => {
       
        if (!userRole) {
            const confirmResponse = await confirmLogin();
            if (confirmResponse) {
                navigate('/login', {state:{redirectTo:`/doctorPublicProfile/${doctorParamsId}`} });
                return
            } else {
                return
            }

        }
        else if (userRole !== 'patient') {
            errorToast(`${userRole}s can't book an appointment. You can contact with Management`);
            return;
        }

        else if (!selectedSlot_id) {

             errorToast('Please select a time slot to confirm booking');
            return;
        }
        else if (bookedSlots?.length){
            const pendingBooked= bookedSlots?.filter(slot => slot.status === 'booked');
            const totalBookedLen = pendingBooked?.length;
            if(totalBookedLen && totalBookedLen >= 3){
                warningToast("A patient can't book more than 3 slots");
                return;
            }
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

        const toastId = toast.loading('Booking your appointment, Please wait..');
        setIsSubmitting(true);
        try {

            const response = await axios.post(`${backendUrl}/pms/bookSlot/${selectedSlot_id}`,
                {
                    docId: localStoredDoctorId,
                    patientId: storedUser.user.id,
                    patientName: storedUser.user.username

                },
                {
                    withCredentials: true
                }
            )
            if (response.data.success) {
                const newSlot = response.data.slot;
                if (Object.keys(newSlot).length > 0) {
                    syncSlots(bookedSlots, newSlot);
                }
                setDoctorSlotsAvailable(prev => {
                    return prev.map(availableDay => {
                        const modifiedSlots = availableDay.slots.map(mySlot => {
                            if (mySlot.slotId === newSlot._id) {
                                return { ...mySlot, status:"booked" as const}
                            }
                            return mySlot;
                        }

                        )
                        return { ...availableDay, slots: modifiedSlots }

                    })
                })
                successToast('Booked Successfully!', { id: toastId })
                
                setTimeout(() => {
                    navigate('/patient-dashboard/myAppointments', {state:{origin:`/doctorPublicProfile/${doctorParamsId}`}});
                }, 1500)
            }
        }
        catch (err) {
           let errorMessage = HandleAxiosError(err);
            errorToast(errorMessage, { id: toastId });
        }
        finally {
            setIsSubmitting(false);
            setSelectedSlot_id('');
        }
    }

    if (isProfileLoading || allDoctors.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center flex gap-3">
                    <span className="text-2xl font-bold text-gray-800">Loading Doctor Profile..</span>
                    <FaSpinner className="animate-spin text-2xl" />
                </div>
            </div>
        );
    }


    return (

        <main className="container mx-auto px-4 py-8">
            <section className="flex flex-col md:flex-row gap-8">
                {(!isProfileLoading && doctorProfile?._id) &&
                    <>
                        <div className="flex-shrink-0">
                            <img
                                src={doctorProfile?.profileImage.imageUrl}
                                alt={`Dr. ${doctorProfile?.username}`}
                                className="object-cover rounded-lg w-full max-w-xs shadow-md h-auto" />
                        </div>

                        <div className="flex-grow">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">Dr. {doctorProfile?.username}</h1>
                            <p className="text-gray-600 mb-6">{doctorProfile?.about}</p>

                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="px-3 py-1 bg-blue-100 rounded-full text-sm text-blue-700">
                                    {doctorProfile?.education}
                                </span>
                                <span className="px-3 py-1 bg-green-100 rounded-full text-sm text-green-700">
                                    {doctorProfile?.speciality}
                                </span>
                                <span className="px-3 py-1 bg-purple-100 rounded-full text-sm text-purple-700">
                                    {doctorProfile?.experience} years experience
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-2">Contact Information</h3>
                                    <p className="text-gray-600">Email: {doctorProfile?.email}</p>
                                    <p className="text-gray-600">Address: {doctorProfile?.address}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-2">Consultation Fee</h3>
                                    <p className="text-2xl font-bold text-blue-600">Rs {doctorProfile?.consultationFee}</p>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Slots</h3>
                            <div className="mb-4 border shadow-xl bg-white border-gray-300 px-8 py-6 rounded-lg">

                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-wrap gap-4">

                                        {slotsLoading && <div>
                                                 Loading Slots..
                                                <FaSpinner className="animate-spin " />
                                                    </div>
                                            }
                                        {(!slotsLoading && doctorSlotsAvailable?.length > 0) && doctorSlotsAvailable.map((day, index) => (
                                            <div key={index}>

                                                <button
                                                    onClick={() => { handleDayId(day._id) }}
                                                    key={index} className={` ${dayId === day._id && 'border-b border-b-purple-700 border-b-8 !bg-blue-200'} 
                                                 text-xs sm:text-base bg-white border border-gray-200 rounded-lg p-4 hover:bg-blue-200 shadow-sm ring-2 focus:ring-2 focus:ring-purple-500 focus:bg-blue-200`}>
                                                    <span className="hover:bg-blue-200">
                                                        {day.date.toLocaleDateString('en-Us', { weekday: 'short', day: "numeric" })}
                                                    </span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        {(!slotsLoading && doctorSlotsAvailable?.length) ? doctorSlotsAvailable.map((day, index) => (

                                            <div className="relative flex flex-wrap" key={index}>
                                                {dayId === day._id && day.slots?.map((slot, slotIndex) => (

                                                    <button key={slotIndex} onClick={() => handleSlotSelection(slot.slotId, slot.status)}
                                                    className={`            
                                                        m-3 text-xs py-4 w-24 rounded-xl shadow-md

                                                        bg-blue-100
                                                        relative
                                                        hover:shadow-lg 
                                                        ease-out
                                                        opacity-0 animate-fade-in
                                                    
                                                    ${((slot.status === 'available') && selectedSlot_id === slot.slotId) ? 'bg-green-400' : 'hover:bg-blue-100'}
                                                    ${(slot.status === "booked" || slot.isArchived) && '!bg-gray-400 hover:bg-gray-400 disabled cursor-not-allowed'} 
                                                        }
                                                    `}
                                                    // or what about doing slot.status !== "available" then cross the slot means if it is booked or cancelled or completed but i think most efficient will be is to display booked differently as compare to cancelled or completed
                                                        style={{ animationDelay: `${slotIndex * 50}ms` }}
                                                    >
                                                        {slot.slotTime}
                                                        {(slot.status === "booked" || slot.isArchived) && <span className="absolute top-0 right-1 text-[10px] text-gray-600">booked</span>}
                                                    </button>
                                                ))}
                                            </div>

                                        )) : 
                                        ''
                                        }
                                        {(!slotsLoading && doctorSlotsAvailable.length === 0)&& <h2 className="text-teal-700"> No slots found for this doctor. </h2>}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">

                                <button
                                    disabled={isSubmitting}
                                    onClick={handleMakeAppointment}
                                    className={` rounded-full max-w-fit text-white ${isSubmitting ? '!bg-gray-400 cursor-not-allowed px-2 py-3' : 'bg-purple-500 transition-colors duration-300 px-2 py-3 hover:shadow-md hover:bg-purple-700'}`}
                                > Book Appointment
                                </button>
                            </div>
                           <div className="flex flex-col gap-5 sm:flex-row sm:gap-10">
                               <button
                                onClick = {() => navigate(-1)}
                                className="inline-flex items-center w-fit text-blue-600 hover:text-blue-800"
                             >
                             
                                Back to Previous Page
                            </button>
                            <Link
                                to="/MakeAppointment"
                                className="inline-flex items-center w-fit text-blue-600 hover:text-blue-800"
                             >
                               
                                Move to All Doctors List
                            </Link>
                            <button
                                onClick = {() => navigate("/")}
                                className="inline-flex items-center w-fit text-blue-600 hover:text-blue-800"
                             >
                                HOME
                            </button>
                            </div>
                        </div>
                    </>
                }
                {!isProfileLoading && !doctorProfile?._id &&
                    <>
                        <h1 className="text-2xl">Doctor Profile Not Found</h1>
                    </>
                }

            </section>
        </main>

    )
}

export default DoctorPublicProfile

