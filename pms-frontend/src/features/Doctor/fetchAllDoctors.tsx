import { useEffect, useState } from "react"
import makeRequest from "../../makeRequesthook"
interface TimeSlots {
    slotTime: string,
    isBooked: boolean,
    _id?: string,
}
interface ProfileImage {
    imageUrl: string,
    public_id: string
}
interface AvailableDays{
    day:string,
    slots:[string]
}
interface DoctorsInterface {
    _id: string,
    username: string,
    email: string,
    password: string,
    profileImage: ProfileImage,
    education: string,
    available:boolean,
    experience:number,
    availableDays:AvailableDays[],
    speciality: string,
    about: string,
    address: string,
    consultationFee: number,
    slots: TimeSlots[]
}


const useFetchAllDoctors = () => {
    const [doctorsList, setDoctorsList] = useState<DoctorsInterface[]>([]);
    const [caughtError, setCaughtError] = useState<string | ''>('');
    const [isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const fetchDoctors = async () => {
            // const toastId = toast.loading('Loading Doctors');
            try {
                const fetchResponse = await makeRequest({ url: 'pms/fetchAllDoctors', method: 'get' })
                if (fetchResponse.data.success) {
                    setDoctorsList(fetchResponse.data.doctorsList);
                    // toast.success("loaded doctors successfully", { id: toastId })
                }
            }
            catch (err) {
                // toast.error("Error while fetching Doctors", { id: toastId })
                setCaughtError(err as string);
                console.error("Get Error while fetching all doctors", err);
            }
            finally{
                setIsLoading(false);
                // toast.dismiss(toastId);
            }
            
        }
        fetchDoctors()
        
    },[])

    return {isLoading, doctorsList, caughtError}
}

export default useFetchAllDoctors