import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormComponent from "./patientFormComponent";
import toast from 'react-hot-toast';
import { ImDatabase } from "react-icons/im";
import HandleAxiosError from "../../utils/handleAxiosError";

interface PatientHistory
{
    date:string,
    diagnosis:string,
    treatment:string,
}

interface PatientData{
    // age:number,
    patientName:string,
    patientId?:string,
    phone:string,
    dateOfBirth:string,
    gender?:string,
    city:string,
    medicalHistory:PatientHistory[]
}
 
// Patient Form Component
const PatientAddForm = () => {
    const [addingNewPatient, setAddingNewPatient] = useState(false);
    const navigate = useNavigate();
// Form submit function 
    async function formSubmit(data:PatientData){
        
        const patientId = `${Date.now()}`;
        const mongoId = '_9343289472335'
        const patientPayload= {
            patientId,
            ...data,
            _id:mongoId
           
        }
        const toastId = toast.loading("Ading Patient..")
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        console.log("data has been reached inside Add Patient : ", patientPayload);
        try{
            setAddingNewPatient(true);
            
            const response = await axios.post(`${backendUrl}/pms/addPatientProfile`, patientPayload);
            console.log("response: ",response);
            if(response.data.success){
                toast.success('Success Response received by Backend', {id:toastId})
            }
        }
        catch(err){
            let errorMessage = HandleAxiosError(err);
            toast.error(errorMessage, { id: toastId });
        }
        finally{
            setAddingNewPatient(false);
        }
    }


    return (

        <div>
            <section className="flex justify-center items-center min-h-screen p-4">
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
                        <button className="text-gray-500 hover:text-gray-800" onClick={() => navigate(-1)}>Back</button>
                    </div>
                </article>
            </section> 
        </div> 
        
    )
}

export default PatientAddForm

