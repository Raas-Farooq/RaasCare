import { useState } from "react"
import DoctorFormComponent from "./doctorForm"

interface TimeSlots{
    slotTime:string,
    isBooked:boolean,
    _id?:string,
}
interface doctorProfileInfoType{
    username:string,
    email:string,
    password:string,
    education:string,
    speciality:string,
    address:string,
    consultationFee:number,
    slots:TimeSlots[]
}


const UpdateDoctorPrfoile = () =>{

    const [initialData, setInitialData] = useState({
        education:'MBBS',
        speciality:'Physician',
        slots:[{
            slotTime:'12:00',
            isBooked:true,
            _id:'394579483'
        }]
    })

    async function updateDoctorInfo(updatedDetail:doctorProfileInfoType){


    }
    return (
        <>
            <h1 className="text-3xl text-yellow-800">Update Profile</h1>

            {/* <DoctorFormComponent receiveUpdatedDetails={updateDoctorInfo} initialData={initialData} /> */}
        </>
    )
}

export default UpdateDoctorPrfoile