import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaSpinner, FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom"


interface Patient{
  _id:string,
  patientName:string,
  patientId:string,
  age?:string,
  diagnosis:string,
  city:string
}

const PatientProfile = () => {

    const {patientId} = useParams();
    const [loadingPatient, setLoadingPatient] = useState<boolean>(false);
    const [currentPatient, setCurrentPatient] = useState<Patient[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        console.log("check if patientId is ther: ", patientId);

        async function fetchPatient(){
            try{
                setLoadingPatient(true);
                console.log("inside the Try")
                const response = await axios.get(`http://localhost:2500/pms/getPatient/${patientId}`);
                console.log("response of Special ", response);
                if(response.data.success){
                    const patient = [response.data.patient];
                    setCurrentPatient(patient);
                }
            }catch(err){
                console.log("err while fetching: ", err)
            }
            finally{
                setLoadingPatient(false)
            }
        } 

        fetchPatient();
    },[patientId])

    function handleEditClick(e:React.MouseEvent<HTMLButtonElement>){
        e.preventDefault();
        navigate('/doctor-dashboard/updatePatientProfile', {state:currentPatient})
    }

    const handleDeleteClick = async() => {

        
        try{
            const response = await axios.delete(`http://localhost:2500/pms/deletePatientProfile/${patientId}`);
            console.log("resposne of delete: ", response);
            if(response.data.success){
                setCurrentPatient([]);
                alert("Successfully Deleted the Patient")
                navigate(-1)
            }
        }
        catch(err){
            console.log("err: ", err);
        }
        finally{

        }
    }

    return(
        <div className="h-screen bg-gray-200 flex justify-center items-center flex-col text-center gap-10">  
            {loadingPatient &&
             <div className="fixed inset-0 bg-black opacity-50 flex z-50 justify-center items-center">
                     <div className="shadow-lg rounded-lg flex justify-center items-center p-6 gap-4 bg-white">
                        <FaSpinner className="animate-spin text-2xl" />
                        <span className="text-xl text-blue-800"> Loading Patient</span>
                    </div>
            </div>}
            {currentPatient && !loadingPatient &&  <div className="flex gap-3">
                 <h1 className="underline decoration-blue-500 text-3xl lg:text-5xl font-bold"> {currentPatient[0]?.patientName} </h1>
                 <button onClick={handleEditClick}><FaEdit /></button>
                 <button onClick={handleDeleteClick}><FaTimes /></button>
                </div>
                }

            <div className="w-screen h-[70vh] bg-white p-6 shadow-xl sm:max-w-xl md:max-w-xl lg:max-w-4xl flex justify-center">
                {currentPatient && currentPatient.map(patient => {
                return (
                    <div key={patient._id} className="space-y-4">
                        <div className="grid grid-cols-3 sm:grid-cols-2 w-[100%]">
                            <span className="text-2xl">Patient ID </span> <h1 className="text-green-500 text-2xl"> {patient.patientId}</h1>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-2 w-[100%]">
                            <span className="text-2xl">Diagnosis </span> <h1 className="text-green-500 text-2xl"> {patient.diagnosis}</h1>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-2 w-[100%]">
                            <span className="text-2xl">Age </span> <h1 className="text-green-500 text-2xl"> {patient.age}</h1>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-2 w-[100%]">
                            <span className="text-2xl">City </span> <h1 className="text-green-500 text-2xl"> {patient.city}</h1>
                        </div>

                        <button onClick={() => navigate(-1)} className="pt-10 text-gray-600 hover:text-black hover:shadow-xl">Back</button>
                    </div>
                )
                })}
                
            </div>
            
        </div>
    )
}

export default PatientProfile