
import DoctorFormComponent from "./doctorForm"
import axios from "axios";
import toast from "react-hot-toast";


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
    slots: TimeSlots[]
}


const AddNewDoctor = () => {
    
    async function handleDoctorSubmission(data: doctorProfileInfoType) {
        const toastId = toast.loading('Adding New Doctor');
        try{
            const response = await axios.post(`http://localhost:2500/pms/createDoctor`, data, 
                {
                    headers:{
                        "Content-Type":"application/json"
                    }
                }
            );
            if(response.data.success){
                toast.dismiss(toastId);
                toast.success('Success! Doctor Added');
            }
            console.log("response of sending new doctor details: ", response);
        }
        catch(err){
            toast.dismiss(toastId);
            toast.error('Error while Adding Toast');
            console.error("error while creating new Doctor ",err);
        }
    }
   
    return (
        <div className="h-screen bg-gray-100">
            <h1 className="p-5 text-3xl text-orange-800 text-center"> Add a New Doctor</h1>
            
            <div className="w-full m-3">
                <DoctorFormComponent receiveUpdatedDetails={handleDoctorSubmission} />
            </div>

        </div>
    )
}

export default AddNewDoctor