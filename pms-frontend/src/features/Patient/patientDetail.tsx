import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaSpinner, FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom"
import makeNgrokRequest from "../../ngrokRequesthook";
import toast from "react-hot-toast";
import { User } from "lucide-react";

interface MedicalHistory{
    diagnosis?:string,
    treatment?:string,
    date?:string
}

interface Patient{
  _id:string,
  patientName?:string,
  patientId?:string,
  dateOfBirth?:string,
  phone:string,
  medicalHistory:MedicalHistory[],
  gender?:string,
  city?:string
}

const PatientProfile = () => {

    const {patientId} = useParams();
    const [loadingPatient, setLoadingPatient] = useState<boolean>(false);
    const [username, setUsername] = useState('');
    const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
    const navigate = useNavigate();

    const [patientRecordId, setPatientRecordId] = useState('');
        const userProfile = localStorage.getItem('profile');
        useEffect(() => {
        if (userProfile) {
            try {
                const parsedProfile = JSON.parse(userProfile);
                console.log("parsed pateint ", parsedProfile);
                setUsername(parsedProfile.username);
                if (parsedProfile.patientRecord) {
                    console.log("if pateint exist and record.. patientRecordId ", parsedProfile.patientRecord);
                    setPatientRecordId(parsedProfile.patientRecord)
                }
            }
            catch (err) {
                console.error('error while parsing the patient profile ', err)
            }
        }
    }, [])

      useEffect(() => {
            if(!patientRecordId){
                return;
            }
            console.log("came inside the useEffect")
            async function fetchPatientRecord(){
                 const toastId = toast.loading('Getting Patient Detail..')
                try{
                   
                    const response = await makeNgrokRequest({url:`pms/getPatient/${patientRecordId}`, method:"get"}); 
        
                    console.log("response of getting Patient Record ", response);
                    if(response.data.success){
                        setCurrentPatient(response.data.patient);
                        toast.success('Successfully ', {id: toastId})
                    }
                    
                }
                catch(err){
                    toast.error("Error while fetching Patient Detail ", {id:toastId})
                }
            }
            fetchPatientRecord()
        }, [patientRecordId])

    // function handleEditClick(e:React.MouseEvent<HTMLButtonElement>){
    //     e.preventDefault();
    //     navigate('/patient-dashboard/updatePatientProfile', {state:currentPatient})
    // }

    // const handleDeleteClick = async() => {

        
    //     try{
    //         const response = await axios.delete(`http://localhost:2500/pms/deletePatientProfile/${patientId}`);
    //         console.log("resposne of delete: ", response);
    //         if(response.data.success){
    //             setCurrentPatient(response.data.patient);
    //             alert("Successfully Deleted the Patient")
    //             navigate(-1)
    //         }
    //     }
    //     catch(err){
    //         console.log("err: ", err);
    //     }
    //     finally{

    //     }
    // }

    return(
        <div className={`bg-gray-100 min-h-screen flex flex-col gap-5 p-8 items-center flex-col`}>  
            <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between mb-8">
                <div className="flex items-center gap-4 text-center sm:text-left mb-4 sm:mb-0">
                 <h1 className="text-gray-800 text-4xl lg:text-5xl font-bold"> {currentPatient?.patientName ? currentPatient.patientName : username} </h1>
                    {/* <div className="flex items-center gap-2">
                        <button 
                        aria-label="Edit Patient Profile"
                        type="button"
                        className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                        onClick={handleEditClick}
                        >
                            <FaEdit size={20} />
                        </button>
                        <button 
                        aria-label="Delete Patient Profile"
                        type="button"
                        className="text-red-500 hover:text-red-700 transition-colors duration-300"
                        onClick={handleDeleteClick}
                        >
                            <FaTimes size={20}/>
                        </button>
                    </div> */}
                </div>

                 <div className="mt-4 sm:mt-0">
                <button 
                type="button" 
                className="hover:scale-105 transition-animation duration-300"
                > 
                <User size={40} color="blue" className="m-0"/> 
                </button>
                </div>
            </div>
            
           
            <div className="w-full max-w-4xl bg-white p-8 shadow-xl rounded-xl mt-4">
          
                    
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm uppercase font-semibold">Patient ID</span>
                            <span className="text-gray-800 text-lg">{currentPatient?.patientId}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm uppercase font-semibold">Diagnosis</span>
                            <span className="text-gray-800 text-lg">
                                {currentPatient?.medicalHistory?.[0]?.diagnosis || 'N/A'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm uppercase font-semibold">Phone</span>
                            <span className="text-gray-800 text-lg">{currentPatient?.phone}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm uppercase font-semibold">Gender</span>
                            <span className="text-gray-800 text-lg">{currentPatient?.gender || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm uppercase font-semibold">City</span>
                            <span className="text-gray-800 text-lg">{currentPatient?.city || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm uppercase font-semibold">Date of Birth</span>
                            <span className="text-gray-800 text-lg">{currentPatient?.dateOfBirth || 'N/A'}</span>
                        </div>
                    </div>
                </div>

            </div>
            
            {/* Back Button */}
             <div className="mt-8">
               <button 
                    onClick={() => navigate(-1)}
                    className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
                >
                    &larr; Back
                </button>
            </div>
        </div>
    )
}

export default PatientProfile
