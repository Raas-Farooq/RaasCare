// import { useEffect, useState } from "react"
// import DoctorFormComponent from "./doctorForm"
// import { useAuth } from "../../../context/appContext"
// import {type DoctorProfileType } from "../../../utils/globalTypes"

// interface TimeSlots{
//     slotTime:string,
//     isBooked:boolean,
//     _id?:string,
// }
// interface doctorProfileInfoType{
//     username:string,
//     email:string,
//     password:string,
//     education:string,
//     speciality:string,
//     address:string,
//     consultationFee:number,
//     slots:TimeSlots[]
// }


// const UpdateDoctorPrfoile = () =>{

//     const {doctorProfile} = useAuth();
//     const [initialData, setInitialData] = useState<DoctorProfileType | null>(null);

//     useEffect(() => {
//         setInitialData(doctorProfile)
//     }, [doctorProfile])


//     async function updateDoctorInfo(updatedDetail:DoctorProfileType){


//     }
//     return (
//         <>
//             <h1 className="text-3xl text-yellow-800">Update Profile</h1>

//             {/* <DoctorFormComponent receiveUpdatedDetails={updateDoctorInfo} initialData={initialData} /> */}
//         </>
//     )
// }

// export default UpdateDoctorPrfoile