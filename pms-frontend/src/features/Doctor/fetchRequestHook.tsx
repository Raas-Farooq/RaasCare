
import {useEffect, useState } from "react";
import toast from "react-hot-toast";
import HandleAxiosError from "../../utils/handleAxiosError";
import makeRequest from "../../makeRequesthook";

// interface IdInterface{
//     type:string | null
// }

interface AvailableDays {
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
    availableDays: AvailableDays[]
}

function useFetchApi(url: string, id: string | null) {
    const [fetchLoading, setFetchLoading] = useState<boolean>(false);
    const [fetchResult, setFetchResult] = useState<DoctorProfileInterface | null>(null);
    const [fetchError, setFetchError] =  useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            return;
        }
        const makingApiRequest = async () => {
            
            const toastId = toast.loading('fetching the data..');
            setFetchLoading(true);
            setFetchError('');
            try {
                const response = await makeRequest({url:`pms/fetchDoctorProfile/${id}`, method:'get'});
                if (response.data.success) {
                    setFetchResult(response.data.doctorProfile);
                    toast.remove(toastId);
                    toast.success("loaded doctors successfully", { id: toastId })
                }
            }
            catch (err: any) {
                let errorMessage = HandleAxiosError(err);
                toast.error(errorMessage, { id: toastId });
            }finally{
                setFetchLoading(false)
            }
        }
        makingApiRequest();
    }, [url,id])

        return { fetchLoading, fetchResult, fetchError }
    
    
}

export default useFetchApi

