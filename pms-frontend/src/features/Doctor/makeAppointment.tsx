
import { useEffect, useState } from "react"
import DoctorsBySpeciality from "./DoctorsBySpeciality";
import { useAuth } from "../../context/appContext";
import { FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";



const MakeAppointment = () => {

    const [specialities, setSpecialities] = useState(['All Doctors']);
    const [target, setTarget ] = useState('All Doctors');

    const {allDoctors, loadedAllDoctors} = useAuth();
    useEffect(() => {
        if(allDoctors.length === 0) return;
  
            const allSpecialities = Array.from(
            new Set(['All Doctors', ...allDoctors.map(doctor => doctor.speciality).filter(Boolean)])
        )
        setSpecialities(allSpecialities);
        
       
    },[ allDoctors, allDoctors?.length>0])

    const handleSpecialityClick = (event:React.MouseEvent<HTMLButtonElement>, speciality:string) => {
        event.preventDefault();
        console.log("speciality Selected: ", speciality);
        setTarget(speciality);
    }

    if(!loadedAllDoctors){
        // toast('Loading All Doctors');
       return (
         <div className="w-full flex text-3xl justify-center items-center ">
            Loading Doctors
            <span className="animate-spin text-2xl ml-3 duration-300"> {<FaSpinner />} </span>
        </div>
       )
    }
   
    if(allDoctors.length === 0){
        return <h1 className="text-xl text-center">No Doctor Found</h1>
    }


    return (
        <div className="relative min-h-screen bg-gray-50 mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl text-purple-600 mb-8 text-center font-bold">Our Experienced Team</h1>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-8 mb-3 p-2 border-b border-gray-300 ">
                    {(loadedAllDoctors && specialities.length > 1) && specialities.map(speciality => (
                        <button 
                        key={speciality}
                        onClick={(e) => handleSpecialityClick(e, speciality)}
                        type="button" 
                        className="text-sm px-4 py-2 border border-gray-500 rounded-xl hover:text-purple-600 hover:border-purple-700 transition-colors duration-200">{speciality}</button>
                    ))}
                </div>
               <DoctorsBySpeciality targetField={target} />
            </div>
        </div>
    )
}

export default MakeAppointment