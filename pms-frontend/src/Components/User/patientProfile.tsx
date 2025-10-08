import { useEffect, useState } from "react";
import makeNgrokRequest from "../../ngrokRequesthook";




const PatientProfile = () => {
    const [patientRecordId, setPatientRecordId] = useState('');
    const userProfile = localStorage.getItem('profile');
    useEffect(() => {
        if (userProfile) {
            try {
                const parsedProfile = JSON.parse(userProfile);
                console.log("parsed pateint ", parsedProfile);
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

    //   useEffect(() => {
    //         if(!patientRecordId){
    //             return;
    //         }
    //         console.log("came inside the useEffect")
    //         async function fetchPatientRecord(){
    //             console.log("now, walking inside the patientRecord Garden")
    //             const response = await makeNgrokRequest({url:`pms/getPatient/${patientRecordId}`, method:"get"}); 

    //             console.log("response of getting Patient Record ", response);
    //         }
    //         fetchPatientRecord()
    //     }, [patientRecordId])

    return (
        <div>
            <h1 className="text-2xl text-brown-600">Patient Profile Details</h1>
        </div>
    )
}

export default PatientProfile