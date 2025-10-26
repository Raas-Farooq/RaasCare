
import DoctorFormComponent from "./doctorForm"
import axios from "axios";
import toast from "react-hot-toast";
import HandleAxiosError from "../../utils/handleAxiosError";


interface TimeSlots {
    slotTime: string,
    isBooked: boolean,
    _id?: string,
}
interface doctorProfileInfoType {
    username: string,
    email: string,
    password: string,
    education: string,
    speciality: string,
    address: string,
    consultationFee: number,
    // slots:TimeSlots
}

  const backend_url = import.meta.env.VITE_BACKEND_URL
const AddNewDoctor = () => {
    
    async function handleDoctorSubmission(data: doctorProfileInfoType) {
        const toastId = toast.loading('Adding New Doctor');
        console.log("doctor data before sending to backend ", data);
        try{
            const response = await axios.post(`${backend_url}/pms/createDoctor`, data, 
                {
                    headers:{
                        "Content-Type":"application/json"
                    }
                }
            );
            if(response.data.success){
                localStorage.removeItem('doctorProfileImage');
                localStorage.removeItem('doctorProfilePublic_id');
                toast.dismiss(toastId);
                toast.success('Success! Doctor Added');
            }
            console.log("response of sending new doctor details: ", response);
        }
        catch(err){
            const errorMessage = HandleAxiosError(err);
            toast.error(errorMessage, { id: toastId });
        }
    }
 ;
    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
            <h1 className="p-1 text-2xl md:text-3xl text-gray-800 text-center font-semibold mb-6"> Add a New Doctor</h1>
            
            <div className="bg-white rounded-xl p-6 md:p-2">
                <DoctorFormComponent receiveUpdatedDetails={handleDoctorSubmission} />
            </div>

        </div>
    )
}

export default AddNewDoctor