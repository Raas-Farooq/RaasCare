import axios from "axios";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import FormComponent from "../../Components/pages/formComponent";

interface PatientData{
    patientName?:string,
    // age:number,
    treatment:string,
    phone:string,
    dateOfBirth?:string,
    date:string,
    gender?:string,
    diagnosis:string,
    city?:string 
}
 
// Patient Form Component
const PatientAddForm = () => {
    const [addingNewPatient, setAddingNewPatient] = useState(false);
    const navigate = useNavigate();
// Form submit function 
    async function formSubmit(data:PatientData){
        console.log("data: ", data);
        const {diagnosis, ...otherData} = data;
        const patientDetails = {
            ...otherData,
            medicalHistory:[
                {
                    diagnosis,
                    date:new Date()
                }
            ]
        }
        try{
            setAddingNewPatient(true);
            const response = await axios.post(`http://localhost:2500/pms/addPatientProfile`, patientDetails);
            console.log("response: ",response);
            if(response.data.success){
                console.log("SUCCESS WINNER")
            }
        }
        catch(err){
            console.log('error :', err);
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
                    {addingNewPatient && 
                        <div className="fixed inset-0 bg-black opacity-50 flex justify-center items-center">
                            <div className="bg-white text-black shadow-lg rounded-md flex justify-center items-center p-4 ">
                                <FaSpinner className="animate-spin text-2xl" /> Adding Patient..
                            </div>
                        </div>
                    }
                    <div className="text-center space-y-3">
                        <button className="text-gray-500 hover:text-gray-800" onClick={() => navigate(-1)}>Back</button>
                    </div>
                </article>
            </section> 
        </div> 
        
    )
}

export default PatientAddForm

