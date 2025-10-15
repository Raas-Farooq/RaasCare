import axios from "axios";
import { ArrowRight, DollarSign, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import makeNgrokRequest from "../../ngrokRequesthook";
import DoctorsBySpeciality from "./DoctorsBySpeciality";
import useFetchAllDoctors from "./fetchAllDoctors";

interface TimeSlots {
    slotTime: string,
    isBooked: boolean,
    _id?: string,
}
interface ProfileImage {
    imageUrl: string,
    public_id: string
}
interface AllDoctorInterface {
    _id:string,
    username: string,
    email: string,
    password: string,
    profileImage: ProfileImage,
    education: string,
    speciality: string,
    about: string,
    address: string,
    consultationFee: number,
    slots: TimeSlots[]
}


const MakeAppointment = () => {
    const [allDoctors, setAllDoctors] = useState<AllDoctorInterface[]>([]);
    const [specialities, setSpecialities] = useState(['All Doctors']);
    const [target, setTarget ] = useState('All Doctors');
    const [displayDoctors, setDisplayDoctors] = useState<AllDoctorInterface[]>([]);
    const navigate = useNavigate();

    const {isLoading, doctorsList, caughtError} = useFetchAllDoctors();
    useEffect(() => {
        if(doctorsList.length > 0 ){
             doctorsList.forEach(doctor => {
     
            setSpecialities(prev => {
                if (prev.includes(doctor.speciality) || doctor.speciality === ''){
                    return prev
                }else{
                    return [...prev, doctor.speciality]
                }
            }
            )
            console.log("specialities : ", specialities);
        })
        }
       
    },[doctorsList.length>0])

    const handleSpecialityClick = (event:React.MouseEvent<HTMLButtonElement>, speciality:string) => {
        event.preventDefault();
        if(speciality === 'All Doctors'){
            setTarget('All Doctors')
            // navigate('/doctorsBySpeciality', {state:{targetField:speciality}})
        }
        else{
            setTarget(speciality);
            // navigate('/doctorsBySpeciality', {state:{targetField:speciality}})
        }
        
    }
    // specialities = ['Physicians', 'Surgeons', 'Psychologists', 'Dentists', 'Cardialogists']
// Feature 	object-cover with object-top	2nd: h-auto/ or set height accordingly object-contain
    return (
        <div className="relative min-h-screen bg-gray-50 mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl text-teal-700 mb-8 text-center">Our Experienced Team</h1>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-8 mb-3 p-2 border-b border-gray-300 ">
                    {doctorsList.length > 0 && specialities.map(speciality => (
                        <button 
                        onClick={(e) => handleSpecialityClick(e, speciality)}
                        type="button" 
                        className="text-sm px-4 py-2 border border-gray-500 rounded-xl hover:text-purple-600 hover:border-purple-700 transition-colors duration-200">{speciality}</button>
                    ))}
                </div>
                <DoctorsBySpeciality targetField={target} />
            </div>
        </div >
    )
}

export default MakeAppointment