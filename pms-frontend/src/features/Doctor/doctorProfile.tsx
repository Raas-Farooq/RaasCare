import { useEffect, useRef, useState } from "react";
import './cssTransition.css';
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
    slotId: string,
    isBooked: boolean,
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
    const [selectedTimeSlot, setSetSelectedTimeSlot] = useState('');
    const [dayId, setDayId] = useState<string | null>('');
    const [isProfileLoading, setIsProfileLoading] = useState<boolean | true>(true);
    const [doctorProfile, setDoctorProfile] = useState<DoctorProfileInterface | null>(null);
    const [doctorSlotsAvailable, setDoctorSlotsAvailable] = useState<AllAvailableSlots[]>([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [selectedSlot_id, setSelectedSlot_id] = useState('');
    const { user, userRole, bookedSlots, setBookedSlots } = useAuth();
    const navigate = useNavigate();
    const effectLoaded = useRef(false);
    const { doctorId } = useParams();
    const urlLink = 'http://localhost:2500/pms/fetchDoctorProfile';
    const backendUrl = import.meta.env.VITE_BACKEND_URL


    // const { fetchLoading, fetchResult, fetchError } = useFetchApi(backendUrl, doctorId || null);
    const gain = { gain: 'No pain No gain' };

    // useEffect(() => {
    //     console.log("Day index of clicked day", dayIndex);
    // }, [dayIndex]);

    useEffect(() => {
        if (!doctorId || effectLoaded.current) {
            return;
        }

        effectLoaded.current = true;

        function updateDateFormat(slotsReceived: AllAvailableSlots[]) {
            console.log("slots received: ", slotsReceived)
            const updatedSlots = slotsReceived.map(slots => {
                return {
                    ...slots,
                    date: new Date(slots.date)
                }
            })
            console.log(" latest slots available; ", updatedSlots);
            setDayId(updatedSlots[0]._id);
            setDoctorSlotsAvailable(updatedSlots);
        }

        const fetchDoctorProfile = async () => {
            setIsProfileLoading(true);
            const fetchDoctorProfile = makeNgrokRequest({ url: `pms/fetchDoctorProfile/${doctorId}`, method: 'get' });
            const fetchdoctorAvailableDays = makeNgrokRequest({ url: `pms/getDoctorAvailableDays/${doctorId}`, method: 'get' });
            // const toastId = toast.loading('Fetching Doctor Profile special');
            await toast.promise(Promise.allSettled([fetchDoctorProfile, fetchdoctorAvailableDays]), {
                'loading': 'Loading Doctor Profile ',
                'success': 'Successfully loaded doctor Profile',
                'error': "Error while fetching Doctor Profile"
            })
            setSlotsLoading(true);
            try {
                console.log("docId before: ", doctorId);
                const [profileResponse, availableSlotsResponse] = await Promise.allSettled([fetchDoctorProfile, fetchdoctorAvailableDays]);
                if (profileResponse.status === 'fulfilled' && profileResponse.value.data.success) {
                    console.log(" profile Response: ", profileResponse);
                    const docProfile = profileResponse.value.data.doctorProfile;
                    setDoctorProfile(docProfile)

                } else {
                    // toast.error(" Failed to load Doctor Profile ", {id:toastId});
                }
                if (availableSlotsResponse.status === 'fulfilled' && availableSlotsResponse.value.data.success) {
                    console.log("availble slots RESSSSS ", availableSlotsResponse)
                    const remainingSlots = availableSlotsResponse.value.data.remainingSlots;
                    if (remainingSlots.length) {
                        updateDateFormat(remainingSlots);
                    }

                } else {
                    console.error("error while fetching available days of doctor ")
                }

            }
            catch (err) {
                console.error("Get Error while generating all doctors slots", err);
            } finally {
                setSlotsLoading(false);
                setIsProfileLoading(false);
            }
        }
        fetchDoctorProfile();

    }, [doctorId])

    useEffect(() => {
        console.log("newly Effect ", doctorSlotsAvailable)
    }, [doctorSlotsAvailable]);


    const handleSlotSelection = (id: string, time: string) => {
        console.log("time received: ", time, " id of slot: ", id, "selected Time slot: ", selectedTimeSlot, "doctorSlots available: ", doctorSlotsAvailable);

        setSetSelectedTimeSlot(time);
        setSelectedSlot_id(id);
    }

    const handleDayId = (id: string) => {
        console.log("id: ", id, "dayIndex: ", typeof (dayId));
        if (selectedSlot_id) {
            setSelectedSlot_id('')
        }
        setDayId(id);


    }

    function syncSlots(bookedSlots: BookedSlots[] | null, newSlot: BookedSlots) {
        console.log("newSlot booked: ", newSlot);
        console.log("doctorSlots Available: ", doctorSlotsAvailable);
        // setDoctorSlotsAvailable(prev => (
        //     prev.filter(prev => prev.)
        // ))
        if (bookedSlots && bookedSlots.length > 0) {
            const validDateSlots = bookedSlots.map((slots: BookedSlots) => {
                return {
                    ...slots,
                    slotDate: {
                        startDate: new Date(slots.slotDate.startDate),
                        endDate: slots.slotDate.endDate ? new Date(slots.slotDate.endDate) : undefined
                    }
                }
            })
            const formattedSlots = [...validDateSlots, newSlot];
            setBookedSlots(formattedSlots);
            // setDoctorSlotsAvailable(formattedSlots);
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
            alert("You aren't allowed to Book an appointment");
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
        const toastId = toast.loading('Making an appointment, Please wait..')
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
                setDoctorSlotsAvailable(prev => {
                    return prev.map(availableDay => {
                        const modifiedSlots = availableDay.slots.map(mySlot => {
                            if (mySlot.slotId === newSlot._id) {
                                return { ...mySlot, isBooked: true }
                            }
                            return mySlot;
                        }

                        )
                        return { ...availableDay, slots: modifiedSlots }

                    })
                })
                toast.success('Booked Successfully!', { id: toastId })
                console.log("Success")
            }
        }
        catch (err) {
            toast.error('Error while booking appointment. Please try again later', { id: toastId })
            console.error('Got Error :', err);
        }
        finally {
            setSelectedSlot_id('');
        }
    }

    if (!isProfileLoading && !doctorProfile) {
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
                {!isProfileLoading &&
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
                            <div className="mb-4 border shadow-xl bg-white border-gray-300 px-8 py-6">

                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-wrap gap-5">

                                        {slotsLoading && <FaSpinner className="animate-spin " />}
                                        {(!slotsLoading && doctorSlotsAvailable?.length) && doctorSlotsAvailable.map((day, index) => (
                                            <div key={index}>

                                                <button
                                                    onClick={() => { handleDayId(day._id) }}
                                                    key={index} className={` ${dayId === day._id && 'border-b border-b-purple-700 border-b-8 !bg-blue-200'} 
                                                 text-xs sm:text-base  bg-white border border-gray-200 rounded-lg p-4 hover:bg-blue-200 shadow-sm ring-2 focus:ring-2 focus:ring-purple-500 focus:bg-blue-200`}>
                                                    <span className="hover:bg-blue-200">
                                                        {day.date.toLocaleDateString('en-Us', { weekday: 'short', day: "numeric" })}
                                                    </span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        {(!slotsLoading && doctorSlotsAvailable?.length) ? doctorSlotsAvailable.map((day, index) => (

                                            <div className="flex" key={index}>
                                                {dayId === day._id && day.slots?.map((slot, slotIndex) => (
                                                    <button key={slotIndex} onClick={() => handleSlotSelection(slot.slotId, slot.slotTime)}
                                                        className={`
                                                    m-3 text-xs py-2 w-24 rounded-xl shadow-md
                                                    bg-blue-100
                                                    hover:shadow-lg 
                                                    ease-out
                                                    opacity-0 animate-fade-in
                                                    
                                                    ${(!(slot.isBooked) && selectedSlot_id === slot.slotId) ? 'bg-green-400' : 'hover:bg-blue-100'}
                                                    ${slot.isBooked ? 'bg-gray-400 hover:bg-gray-400 disabled cursor-not-allowed' : 'bg-blue-200 hover:bg-blue-300'}
                                                    `}
                                                        style={{ animationDelay: `${slotIndex * 50}ms` }}
                                                    >
                                                        {slot.slotTime}
                                                    </button>
                                                ))}
                                            </div>

                                        )) :
                                            <h2 className="text-yellow-500">Slots Not Found </h2>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">

                                <button
                                    onClick={handleMakeAppointment}
                                    className="bg-purple-400 rounded-full max-w-fit px-2 py-3 hover:shadow-md hover:bg-purple-500"> Book Appointment</button>
                            </div>
                            <Link
                                to="/allDoctorsPublic"
                                className="inline-flex items-center text-blue-600 hover:text-blue-800"
                            >
                                <ArrowLeft size={20} />
                                Back to Doctors List
                            </Link>
                        </div>
                    </>
                }
            </section>
        </main>

    )
}

export default DoctorPublicProfile
