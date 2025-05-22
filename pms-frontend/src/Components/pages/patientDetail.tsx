import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

const PatientProfile = () => {

    const {patientId} = useParams();
    const [loadingPatient, setLoadingPatient] = useState<boolean>(false);
    const [currentPatient, setCurrentPatient] = useState([]);
    useEffect(() => {
        console.log("check if patientId is ther: ", patientId);

        async function fetchPatient(){


            try{
                setLoadingPatient(true);
                console.log("inside the Try")
                const response = await axios.get(`http://localhost:2500/pms/getPatient/${patientId}`);
                console.log("response of Special ", response);
                if(response.data.success){
                    setCurrentPatient(response.data.patient);
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
    return(
        <>
            <h2> This is the Patient Profile</h2>
        </>
    )
}

export default PatientProfile