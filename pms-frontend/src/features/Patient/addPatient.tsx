import axios from "axios";
import { useNavigate } from "react-router-dom";
import FormComponent from "./patientFormComponent";
import toast from 'react-hot-toast';
import HandleAxiosError from "../../utils/handleAxiosError";
import type { PatientFormType } from "./patient.types";
import type { UseFormReset } from "react-hook-form";



// Patient Form Component
const PatientAddForm = () => {
    const navigate = useNavigate();
// Form submit function 
    async function formSubmit(data:PatientFormType, resetForm:UseFormReset<PatientFormType>){
        
        const patientId = `${Date.now()}`;
        const mongoId = '_9343289472335'
        const patientPayload= {
            patientId,
            ...data,
            _id:mongoId
           
        }
        const toastId = toast.loading("Ading Patient..")
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try{
            const response = await axios.post(`${backendUrl}/pms/addPatientProfile`, patientPayload);
            if(response.data.success){
                toast.success('Success Response received by Backend', {id:toastId});
                resetForm()
            }
        }
        catch(err){
            let errorMessage = HandleAxiosError(err);
            toast.error(errorMessage, { id: toastId });
        }
    }


    return (

        <div>
            <section className="flex justify-center items-center p-4">
                <article className="w-full max-w-2xl rounded-lg shadow-xl p-6">
                    <h1 className="text-center text-2xl text-green-600 font-semibold mb-6">Enter The Details of New Patient</h1>
                    <FormComponent receiveSubmitData={formSubmit} />
                    {/* {addingNewPatient && 
                        <div className="fixed inset-0 bg-black opacity-50 flex justify-center items-center">
                            <div className="bg-white text-black shadow-lg rounded-md flex justify-center items-center p-4 ">
                                <FaSpinner className="animate-spin text-2xl" /> Adding Patient..
                            </div>
                        </div>
                    } */}
                    <div className="text-center space-y-3">
                        <button 
                        type="button"
                        className="text-gray-600 !cursor-pointer hover:text-gray-900" 
                        onClick={() => navigate(-1)}>
                            Back
                            </button>
                    </div>
                </article>
            </section> 
        </div> 
        
    )
}

export default PatientAddForm

