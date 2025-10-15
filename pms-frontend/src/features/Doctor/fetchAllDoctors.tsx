import { useEffect, useState } from "react"
import makeNgrokRequest from "../../ngrokRequesthook"
import toast from "react-hot-toast";

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

const backend_url = import.meta.env.VITE_BACKEND_URL;

const useFetchAllDoctors = () => {
    const [doctorsList, setDoctorsList] = useState<AllDoctorInterface[]>([]);
    const [caughtError, setCaughtError] = useState<string | ''>('');
    const [isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const fetchDoctors = async () => {
            const toastId = toast.loading('Loading Doctors');
            try {
                const fetchResponse = await makeNgrokRequest({ url: 'pms/fetchAllDoctors', method: 'get' })
                if (fetchResponse.data.success) {
                    console.log('doctors fetchResponse ', fetchResponse);
                    setDoctorsList(fetchResponse.data.doctorsList);
                    toast.success("loaded doctors successfully", { id: toastId })
                }
            }
            catch (err) {
                toast.error("Error while fetching Doctors", { id: toastId })
                setCaughtError(err as string);
                console.error("Get Error while fetching all doctors", err);
            }
            finally{
                setIsLoading(false);
                toast.dismiss(toastId);
            }
            
        }
        fetchDoctors()
        
    },[])

    return {isLoading, doctorsList, caughtError}
}

export default useFetchAllDoctors