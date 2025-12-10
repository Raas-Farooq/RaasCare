// import { zodResolver } from "@hookform/resolvers/zod"
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import FormComponent from "./patientFormComponent";
import axios from "axios";
import {toast} from "sonner";
import { FaSpinner } from "react-icons/fa";
import { useEffect, useState } from "react";
import HandleAxiosError from "../../utils/handleAxiosError";
import { errorToast, successToast } from "../../utils/toastStyle";


 interface PatientHistory
{
    date:string,
    diagnosis:string,
    treatment:string,
    _id?:string
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
// type PatientDataType=z.infer<typeof patientSchema>
const backend_url = import.meta.env.VITE_BACKEND_URL;
function UpdatePatientProfile(){
    const [updatingPatientLoading, setUpdatingPatientLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [objectId, setObjectId] = useState('');
    const patientData = location.state?.[0];

    const isMedicalHistoryMatched = (history1:PatientData["medicalHistory"],history2:PatientData["medicalHistory"]) => {
        if(history1.length !== history2.length) return false
       return history1.every((field, index) => {
            const otherField = history2[index];
            return (
                field.date === otherField.date &&
                field.diagnosis === otherField.diagnosis &&
                field.treatment === otherField.treatment
            )
        })
    }
    const normalizeHistory = (history: PatientData["medicalHistory"]) =>
        history.map(({ date, diagnosis, treatment }) => ({
            date,
            diagnosis,
            treatment,
    }));

    useEffect(() => {
        setObjectId(patientData._id);
    },[patientData])

   const mySubmitFunction = async (data:PatientData) => {
    let userUpdatedFields:{[key:string]:any} = {};
    
     Object.entries(data).forEach(([key, val]) => {
        if(key === 'medicalHistory'){
            const history= patientData.medicalHistory;
            const updatedHistory = val as PatientData["medicalHistory"];
            if(!isMedicalHistoryMatched(normalizeHistory(history), normalizeHistory(updatedHistory))){
                userUpdatedFields[key]= val;
            }
        }
        else if(key === 'dateOfBirth'){
            const formatDOB = patientData[key].split("T")[0];
            if(formatDOB !== val){
                userUpdatedFields[key] = val;
            }
        }
        else if(patientData[key] !== val){
            userUpdatedFields[key] = val
        }
    })
    if(Object.keys(userUpdatedFields).length === 0){
        toast.dismiss();
        toast("No changes detected from the Original profile", {
            duration:3000,
            id:'No changes made'
        });
        return;
    }
    const toastId = toast.loading("Updating a Patient Profile ..")
    const patchPatientDetail = new FormData();
    patchPatientDetail.append('updatedDetail', JSON.stringify(userUpdatedFields));
    try{
        setUpdatingPatientLoading(true);
        const response = await axios.put(`${backend_url}/pms/updatePatientProfile/${objectId}`,
            patchPatientDetail
        )
            if(response.data.success){
                
                successToast("Successfully Updated the Patient", {id:toastId});
                navigate(-1);
            }
    }
    catch(err){
         let errorMessage = HandleAxiosError(err);
            errorToast(errorMessage, { id: toastId });
          }
    finally{
        setUpdatingPatientLoading(false);
    }
    
   }

    return (
        <div className="h-screen bg-gray-200 flex justify-center items-center flex flex-col ">
            {updatingPatientLoading && 
            <div className="fixed inset-0 bg-black z-40 opacity-50 flex justify-center items-center">

                <div className="shadow-lg rounded-lg flex justify-center items-center p-6 gap-4 bg-white">
                    <FaSpinner className="animate-spin text-xl"></FaSpinner>
                    <span className="text-xl text-blue-800"> Updating Patient.. </span>
                 </div>
            </div>
            }
            <article className="w-full max-w-xl shadow-xl rounded-lg px-8 py-3 bg-white">
                    <h1 className="underline decoration-blue-500 text-2xl font-bold">UPDATE PATIENT</h1>
                    <FormComponent receiveSubmitData={mySubmitFunction} initialData={patientData} updating={true} />
            </article>
        </div>
    )
}

export default UpdatePatientProfile