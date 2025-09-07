
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
    // slots:TimeSlots
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
                localStorage.removeItem('doctorProfileImage');
                localStorage.removeItem('doctorProfilePublic_id');
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
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
            <h1 className="p-1 text-2xl md:text-3xl text-gray-800 text-center font-semibold mb-6"> Add a New Doctor</h1>
            
            <div className="bg-white rounded-xl p-4 md:p-6">
                <DoctorFormComponent receiveUpdatedDetails={handleDoctorSubmission} />
            </div>

        </div>
    )
}

export default AddNewDoctor