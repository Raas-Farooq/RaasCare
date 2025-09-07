import axios from "axios";
import {useEffect, useState } from "react";
import toast from "react-hot-toast";
import makeNgrokRequest from "../../ngrokRequesthook";

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
interface NgrokCall{
    url:string,
    method:string,
    data?:object
}
function useFetchApi(url: string, id: string | null) {
    const [fetchLoading, setFetchLoading] = useState<boolean>(false);
    const [fetchResult, setFetchResult] = useState<DoctorProfileInterface | null>(null);
    const [fetchError, setFetchError] =  useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            return;
        }
        console.log("id and url inside hook ", id, url);
        const makingApiRequest = async () => {
            
            const toastId = toast.loading('fetching the data..');
            setFetchLoading(true);
            setFetchError('');
            try {
                const response = await makeNgrokRequest({url:`pms/fetchDoctorProfile/${id}`, method:'get'});
                if (response.data.success) {
                    console.log('doctor fetchResponse ', response);
                    setFetchResult(response.data.doctorProfile);
                    toast.success("loaded doctors successfully", { id: toastId })
                }
            }
            catch (err: any) {
                toast.error("Error while fetching Doctors", { id: toastId });
                setFetchError(err);
                console.error("Get Error while fetching doctor", err);
            }
            finally {
                setFetchLoading(false)
            }
        }
        makingApiRequest();
    }, [url,id])

        return { fetchLoading, fetchResult, fetchError }
    
    
}

export default useFetchApi