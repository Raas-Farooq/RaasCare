import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm, type UseFormReset } from "react-hook-form";
import toast from "react-hot-toast";
import { Calendar,  Trash2 } from 'lucide-react';
import UploadProfileImage from "./doctorProfileImage";
import { doctorFormSchema, type DoctorSchemaType, type ProfileImageProps } from "../admin.types";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const COMMON_TIME_SLOTS = [
    '09:00-09:30 AM', '09:30-10:00 AM', '10:00-10:30 AM', '10:30-11:00 AM',
    '11:00-11:30 AM', '11:30-12:00 PM', '04:00-04:30 PM', '04:30-05:00 PM',
    '07:00-07:30 PM', '07:30-08:00 PM', '08:00-08:30 PM', '08:30-09:00 PM'
];


interface DoctorFormProps {
    initialData?: DoctorSchemaType,
    receiveUpdatedDetails: 
    (data: DoctorSchemaType,
        resetForm:UseFormReset<DoctorSchemaType>, 
        imgSrc:string, 
        setImgSrc:React.Dispatch<React.SetStateAction<string>>
    ) => 
        Promise<void>;
    imgSrc:string,
    setImgSrc:React.Dispatch<React.SetStateAction<string>>,
    profileImageData:ProfileImageProps,
    setProfileImageData:React.Dispatch<React.SetStateAction<ProfileImageProps>>,
    isAdded:boolean
};


function DoctorFormComponent({ receiveUpdatedDetails, initialData, imgSrc, setImgSrc, profileImageData, setProfileImageData }: DoctorFormProps) {
    const [commonTimeSlots, setCommonTimeSlots] = useState(COMMON_TIME_SLOTS);
    const [allottedDays, setAllottedDays] = useState(['']);
    const [chosenDay, setChosenDay] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [specialSlots, setSpecialSlots] = useState<string[]>([]);
  
    const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(doctorFormSchema),
        defaultValues: initialData || {
            availableDays: [],
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'availableDays'
    })

    console.log("allotted days: ", allottedDays);

    const handleFormSubmission = async (data: DoctorSchemaType) => {
        if (!profileImageData.imageUrl) {
            // toast.dismiss(toastId);
            toast.error('Profile Image is missing');
            return;
        }


        const doctorProfileDetails = {
            profileImage: profileImageData,
            ...data
        }
        setSubmitting(true)
        try {
            await receiveUpdatedDetails(doctorProfileDetails, reset, imgSrc,setImgSrc)
        }
        finally {
            setSubmitting(false);
        }
    }

    const handleSlotToggle = (time: string) => {
        setSpecialSlots(prev =>
            prev.includes(time)
                ? prev.filter(slot => slot !== time) // deselect
                : [...prev, time] // select
        );
    };

    const handleDayClicked = (day: string) => {
        if (chosenDay === day) {
            setChosenDay('')
        } else {
            setChosenDay(day)
        }

    }


    function handleSaveSlots() {
        if (specialSlots.length === 0 && !chosenDay) {
            toast.error("Please select the day and slots first", {
                duration: 3000
            })
            return null
        }
        else if (!chosenDay) {
            toast.error('Please Select the Day First', {
                duration: 3000
            });
            return null
        }
        else if (specialSlots.length === 0) {
            toast.error('Please Select the Slots', {
                duration: 3000
            });
            return null
        }

        if (chosenDay) {
            append({ day: chosenDay as any, slots: specialSlots })
            setSpecialSlots([]);
            setAllottedDays((prev) => {
                if (prev.includes(chosenDay)) {
                    return prev
                } else {
                    return [...prev, chosenDay]
                }
            })
            setChosenDay('');
        }
        setCommonTimeSlots(COMMON_TIME_SLOTS);

    }

    const handleRemoveSlot = (day: string) => {
        setAllottedDays(prev => prev.filter(storedDay => storedDay != day))
    }
    return (
        <div className="min-h-screen flex justify-center items-start overflow-x-hidden bg-white px-2 py-3 sm:px-8 md:px-2">
            <main className="w-full max-w-2xl md:p-2 sm:p-8 bg-white rounded-lg shadow-sm">
                {/* flex-1 space-y-4 min-w-0  */}
                <form onSubmit={handleSubmit(handleFormSubmission, (formErrors) => console.log('caught errors while submitting form', formErrors))}
                    className="flex flex-col md:flex-row gap-8">
                    <div className="w-full grid grid-cols-1 gap-5">
                        <div className="max-w-xs">
                            <UploadProfileImage 
                             imgSrc={imgSrc} 
                             setImgSrc={setImgSrc} 
                             profileImageData={profileImageData} 
                             setProfileImageData={setProfileImageData}
                              />
                        </div>
                        <div>
                            <label
                                className="text-gray-400 block"
                                htmlFor="name">Enter Doctor Name *</label>
                            <input
                                type="text"
                                {...register('username')}
                                className="border-b border-gray-700 w-full outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 px-2 py-2"
                                id="name"
                            />
                            {errors.username && <span className="text-red-700">{errors.username?.message?.toString()}</span>}
                        </div>
                        <div>
                            <label
                                className="text-gray-400 block"
                                htmlFor="email">Enter valid Email *</label>
                            <input
                                type="email"
                                {...register('email')}
                                className="border-b border-gray-700 w-full focus:outline-none px-2 py-2"
                                id="email"
                            />
                            {errors.email && <span className="text-red-700">{errors.email?.message?.toString()}</span>}
                        </div>
                        <div>
                            <label
                                className="text-gray-400 block"
                                htmlFor="password">Password of Doctor *</label>
                            <input
                                type="password"
                                {...register('password')}
                                className="border-b border-gray-700 w-full focus:outline-none px-2 py-2"
                                id="password"
                            />
                            {errors.password && <span className="text-red-700">{errors.password?.message?.toString()}</span>}
                        </div>
                        <div>
                            <label
                                className="text-gray-400 block"
                                htmlFor="education">Educational Degress Exp. MBBS, FCPS *
                            </label>
                            <input
                                type="text"
                                {...register('education')}
                                className="border-b border-gray-700 w-full focus:outline-none px-2 py-2"
                                id="education"
                            />
                            {errors.education && <span className="text-red-700">{errors.education?.message?.toString()}</span>}
                        </div>
                        <div>
                            <label htmlFor="speciality" className="text-gray-400 block"> Speciality of Doctor Exp Physician, Cardialogist *</label>
                            <input
                                type="text"
                                {...register('speciality')}
                                id="speciality"
                                className="border-b border-gray-700 w-full focus:outline-none px-2 py-2"
                            />
                            {errors.speciality && <span className="text-red-700">{errors.speciality?.message?.toString()}</span>}
                        </div>

                    </div>
                    <div className="w-full flex-2 space-y-2">
                        <div>
                            <label
                                className="text-gray-400 block"
                                htmlFor="experience">Enter Experience in Years *</label>
                            <input
                                type="number"
                                {...register('experience')}
                                className="border-b border-gray-700 w-full focus:outline-none px-2 py-2"
                                id="experience"
                            />
                            {errors.experience && <span className="text-red-700">{errors.experience?.message?.toString()}</span>}
                        </div>
                        <div>
                            <label
                                className="text-gray-400 block"
                                htmlFor="address">Enter Address Of The Doctor *</label>
                            <input
                                type="text"
                                {...register('address')}
                                className="border-b border-gray-700 w-full focus:outline-none px-2 py-2"
                                id="address"
                            />
                            {errors.address && <span className="text-red-700">{errors.address?.message?.toString()}</span>}
                        </div>
                        <div>
                            <label
                                className="text-gray-400 block"
                                htmlFor="consultationFee">Consultation Fee *</label>
                            <input
                                type="number"
                                {...register('consultationFee')}
                                className="border-b border-gray-700 w-full focus:outline-none px-2 py-2"
                                id="consultationFee"
                            />
                            {errors.consultationFee && <span className="text-red-700">{errors.consultationFee?.message?.toString()}</span>}
                        </div>
                        <div>
                            <label
                                className="text-gray-400 block"
                                htmlFor="role">Role *</label>
                            <select
                                {...register('role')}
                                className="border-b border-gray-700 w-full focus:outline-none px-2 py-2"
                                id="role"
                            >
                                <option value="">Select A Role..</option>
                                <option value="doctor">Doctor</option>
                            </select>
                            {errors.role && <span className="text-red-700">{errors.role?.message?.toString()}</span>}
                        </div>
                        <div>
                            <label htmlFor="about" className="text-gray-400 block">About Doctor</label>
                            <textarea
                                rows={10} cols={30}
                                className="border border-gray-800 focus:outline-none focus:ring-2 focus:border-none focus:ring-blue-400 w-full max-w-md"
                                {...register('about')}
                            />
                            {errors.about && <p className="text-red-500">{errors.about?.message?.toString()}</p>}
                        </div>
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                                <Calendar className="mr-2 h-5 w-5" />
                                Available Days
                            </h3>
                            <div>
                                {daysOfWeek.map((day, ind) => (
                                    <button
                                        key={ind}
                                        type="button"
                                        onClick={() => handleDayClicked(day)}
                                        disabled={allottedDays.includes(day)}
                                        className={`border border-gray-300 rounded-lg p-2 m-1 
                                        ${chosenDay === (day) && '!bg-blue-300'} 
                                        ${allottedDays.includes(day) ? 'disabled:bg-gray-400 disabled:cursor-not-allowed pointer-events-none' : 'hover:bg-blue-100'}`}> {day}</button>
                                ))}

                                {!chosenDay && <p className="text-yellow-600"> please Select the day first</p>}


                            </div>
                            <div>
                                {chosenDay &&
                                    <p className="my-1 border-b-2 border-gray-400"> Select slots for <span className="text-blue-700">{chosenDay} </span></p>
                                }
                                <div className="grid grid-cols-2 gap-2">

                                    {commonTimeSlots.map(time => {
                                        const isSelected = specialSlots.includes(time);
                                        return (
                                            <div>
                                                <button
                                                    key={time}
                                                    type="button"
                                                    onClick={() => handleSlotToggle(time)}
                                                    className={`px-3 py-1 rounded-lg border 
                                                        ${isSelected
                                                            ? "!bg-blue-400 text-white border-blue-600"
                                                            : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            </div>

                                        );
                                    })}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSaveSlots}
                                    className="border border-gray-300 px-4 py-2 rounded-xl hover:!bg-blue-800 text-white hover:border-white !bg-blue-600 mt-1">
                                    Save Slots for {chosenDay}
                                </button>

                            </div>
                            <div className="mt-4 border-t pt-4">
                                <h4 className="text-md font-semibold">{allottedDays.length > 1 && 'Saved Slots'}</h4>
                                <div className="max-h-60 overflow-y-auto mt-2">
                                    {fields.map((field, index) => (
                                        <>
                                            <div key={field.id}>
                                                <h2 className="italic underline text-gray-800"> {field.day} Slots</h2>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {field.slots.map((timeSlot:string, uni:number) => (
                                                        <p key={uni} className="border border-gray-200 rounded-full text-blue-800 bg-blue-100 text-sm px-2.5 py-0.5">{timeSlot}</p>
                                                    ))}
                                                </div>

                                            </div>
                                            <button type="button" className="text-red-500 ml-3 mt-1 flex items-center" onClick={() => {
                                                handleRemoveSlot(field.day);
                                                remove(index)
                                            }
                                            }>
                                                <Trash2 className="h-4 w-4 mb-2"/>
                                            </button>
                                        </>

                                    ))}
                                </div>
                            </div>
                            {errors.availableDays?.root?.message && <p className="text-red-500">{errors.availableDays?.root?.message}</p>}

                            <button 
                                disabled={submitting}
                                type="submit" 
                                className={`px-4 py-2 rounded-lg shadow-md ${submitting ? 'cursor-not-allowed !bg-gray-400' : '!rounded-2xl hover:shadow-md !bg-orange-500 text-white hover:!bg-orange-700 transition-all duration-300'}`}>
                                {submitting ? 'Submitting': 'Submit'}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div >
    )
}

export default DoctorFormComponent

//  {daysOfWeek.map((day, ind) => (
//                                     <button
//                                         type="button"
//                                         onClick={() => handleDayClicked(day)}
//                                         disabled={allottedDays.includes(day)}
//                                         className={`border border-gray-300 p-2 m-1 
//                                         ${chosenDay === (day) && '!bg-blue-300'} 
//                                         ${allottedDays.includes(day) ? 'disabled:bg-gray-400 disabled:cursor-not-allowed pointer-events-none' : 'hover:bg-blue-100'}`}> {day}</button>
//                                 ))}

// 
// will the 'disabled' work if i dont set this inside button like this ' disabled={allottedDays.includes(day)} '