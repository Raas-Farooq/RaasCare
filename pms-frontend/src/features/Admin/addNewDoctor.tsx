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


const AddNewDoctor = ()=>{

    async function handleDoctorSubmission(data:doctorProfileInfoType){
        console.log("Data received Inside Add new Doctor ", data);
    }

    return (
        <div>
            <h1 className="text-3xl text-orange-800 text-center"> Add a New Doctor</h1>
            <div>
                <input type="file" accept="/*image" />
            </div>
            <div className="w-full">
                  <DoctorFormComponent receiveUpdatedDetails={handleDoctorSubmission} />
            </div>
          
        </div>
    )
}

export default AddNewDoctor