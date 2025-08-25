import axios from "axios";
import { ArrowRight, DollarSign, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

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


const AllDoctors = () => {
    const [allDoctors, setAllDoctors] = useState<AllDoctorInterface[]>([]);
    const fetchRef = useRef(false);

    useEffect(() => {
        if (fetchRef.current) return;
        fetchRef.current = true;
        const fetchDoctors = async () => {
            const toastId = toast.loading('Loading Doctors');
            try {
                const fetchResponse = await axios.get('http://localhost:2500/pms/fetchAllDoctors');
                if (fetchResponse.data.success) {
                    console.log('doctors fetchResponse ', fetchResponse);
                    setAllDoctors(fetchResponse.data.doctorsList);
                    toast.success("loaded doctors successfully", { id: toastId })
                }
            }
            catch (err) {
                toast.error("Error while fetching Doctors", { id: toastId })
                console.error("Get Error while fetching all doctors", err);
            }
        }
        fetchDoctors()
    }, [])


    return (
        <div className="min-h-screen bg-gray-50 mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl text-teal-700 mb-8 text-center">Our Experienced Team</h1>
                <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-center">
                    {allDoctors && allDoctors.length > 0 && allDoctors?.map((doctor, index) => (
                        <Link
                            key={index}
                            to={`/doctorPublicProfile/${doctor._id}`}
                            className="group block shadow-md bg-white 
                            px-4 py-8 flex-col rounded-2xl overflow-hidden hover:shadow-xl 
                            transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex flex-col h-full">
                                <div className="relative overflow-hidden">
                                    <img
                                        className="w-full h-68 object-cover group-hover:scale-105 transition-transform duration-500"
                                        src={doctor.profileImage.imageUrl}
                                        alt={`${doctor.username} Profile`}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Speciality Badge */}
                                    <div className="absolute top-4 right-4 bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                        {doctor.speciality}
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="text-center mb-3">
                                        <h2 className="font-bold text-xl text-gray-800 group-hover:text-teal-600 transition-colors duration-200">
                                          {doctor.username}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">{doctor.education}</p>
                                    </div>

                                    {/* Fee and Rating */}
                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center text-gray-700">
                                            <DollarSign className="text-teal-500 mr-1" size={18} />
                                            <span className="font-semibold">{doctor.consultationFee}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-5 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="text-center">
                                        <span className="inline-flex items-center text-sm text-teal-600 font-medium">
                                            View Profile
                                            <ArrowRight className="ml-1" size={14} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div >
        </div >
    )
}

export default AllDoctors