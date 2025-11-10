
import DoctorFormComponent from "./doctorForm"
import axios from "axios";
import toast from "react-hot-toast";
import HandleAxiosError from "../../../utils/handleAxiosError";
import type { UseFormReset } from "react-hook-form";
// import { z } from "zod";
import type { DoctorSchemaType } from "../admin.types";
import { useState } from "react";
import makeRequest from "../../../makeRequesthook";


  const backend_url = import.meta.env.VITE_BACKEND_URL
const AddNewDoctor = () => {
    const [choosenImage, setChoosenImage] = useState('');
    const [isAdded, setIsAdded] = useState(false);
      const [profileImageData, setProfileImageData] = useState({
            imageUrl: '',
            public_id: ''
        });
        async function generateSlots(docId:string){
            const id = toast.loading('Generating 2 weeks slots.. ')
            try{
                const response = await makeRequest({url:'pms/generateNewDoctorSlots', method:'get', data:{generateFor:"doctor", doctorId:docId}});

                if(response.data.success){
                    toast.success('Successfully Generated Slots', {id:id});
                }

            }
            catch(err){
                console.error('Error while Generating Doctor Slots', err);
                const message = HandleAxiosError(err);
                toast.error(message, {id:id});
            }
        }
    async function handleDoctorSubmission(data: DoctorSchemaType, resetForm:UseFormReset<DoctorSchemaType>) {
        const toastId = toast.loading('Adding New Doctor');
        console.log("doctor data before sending to backend ", data, "resetForm ",resetForm);
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
                resetForm();
                setProfileImageData({
                    imageUrl:'',
                    public_id:''
                })
                setChoosenImage('');
                setIsAdded(true);
                toast.success('Success! Doctor Added', {id:toastId});
                generateSlots(response.data.doctor._id);
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
                <DoctorFormComponent 
                receiveUpdatedDetails={handleDoctorSubmission} 
                imgSrc={choosenImage} setImgSrc ={setChoosenImage} 
                profileImageData={profileImageData} 
                setProfileImageData={setProfileImageData}
                isAdded={isAdded} 
                />
            </div>

        </div>
    )
}

export default AddNewDoctor