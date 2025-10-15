import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { Calendar, Clock, Delete, Plus, Trash2 } from 'lucide-react';
import { string, z } from "zod";
import UploadProfileImage from "./doctorProfileImage";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const daysEnum = z.enum(daysOfWeek);
const DaysAndSlots = z.array(z.object({
    day: daysEnum,
    slots: z.array(z.string()).min(1, "Atleast 1 slot must be selected")
}))
const doctorSchema = z.object({
    username: z.string().min(2, "doctor name must contains atleast 2 characters"),
    email: z.string().email().nonempty("Email should be valid "),
    password: z.string().min(6, "password must contains atleast 6 characters"),
    education: z.string().nonempty("Education of Doctor is required"),
    experience: z.coerce.number().min(0, "Experience of Doctor is required"),
    about: z.string().min(15, "About Details must not less than 15 characters"),
    speciality: z.string().nonempty("speciality is required"),
    address: z.string().nonempty("address of doctor is missing"),
    consultationFee: z.coerce.number().min(300, "consultation Fee should be atleast 300 "),
    role: z.string().nonempty("Doctor role is required"),
    availableDays: DaysAndSlots
})

type DoctorSchemaType = z.infer<typeof doctorSchema>;

const COMMON_TIME_SLOTS = [
    '9:00-9:30 AM', '9:30-10:00 AM', '10:00-10:30 AM', '10:30-11:00 AM',
    '11:00-11:30 AM', '11:30-12:00 AM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM'
];

interface ImagePayloadProps {
    imageUrl: string,
    public_id: string
}

interface DoctorFormProps {
    initialData?: DoctorSchemaType,
    receiveUpdatedDetails: (data: DoctorSchemaType) => Promise<void>
};


// const DaysSlotsSchema = z.array(DaysAndSlots);
// type AvailableDaysSlotsType= z.infer<typeof DaysSlotsSchema>
interface AvailableDaysSlots {
    day: string,
    slots: string[]
}
function DoctorFormComponent({ receiveUpdatedDetails, initialData }: DoctorFormProps) {
    const [commonTimeSlots, setCommonTimeSlots] = useState(COMMON_TIME_SLOTS);
    const [chosenDay, setChosenDay] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [qualityTime, setQualityTime] = useState({
        time: '',
        id: ''
    })
    const [specialSlots, setSpecialSlots] = useState<string[]>([]);
    const [daysSelected, setDaysSelected] = useState<string[]>(['']);
    const [actualSlotsSave, setActualSlotsSave] = useState<AvailableDaysSlots[]>([]);
    const [profileImageData, setProfileImageData] = useState({
        imageUrl: '',
        public_id: ''
    });
    const [isUploading, setIsUploading] = useState(false);
    const { register, control, handleSubmit, formState: { errors }, watch, reset, setValue, getValues } = useForm({
        resolver: zodResolver(doctorSchema),
        defaultValues: initialData || {
            availableDays: [],
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'availableDays'
    })

    const addSlot = () => {
        const slotData = { slotTime: '', isCompleted: false, isCancelled: false, isBooked: false, patientId: undefined };
        return slotData
    }

    const watchedDays = watch('availableDays');

    // useEffect(() => {
    //     console.log("watched watchedDays: ", watchedDays)
    // }, [watchCities, watchedDays])


    function getUploadedImage(imagePayload: ImagePayloadProps, imageUploading: boolean) {
        console.log("imagePayload ", imagePayload, "imageUploading ", imageUploading)
        setProfileImageData(prev => ({
            ...prev,
            imageUrl: imagePayload.imageUrl,
            public_id: imagePayload.public_id
        }))
        setIsUploading(imageUploading);

    }

    const handleFormSubmission = async (data: DoctorSchemaType) => {
        console.log("data Received of Form Submission ", data);
        const toastId = toast.loading('Loading details');
        if (!profileImageData.imageUrl) {
            toast.dismiss(toastId);
            toast.error('Profile Image is missing');
            return;
        }


        const doctorProfileDetails = {
            profileImage: profileImageData,
            ...data
        }
        setSubmitting(true)
        try {
            await receiveUpdatedDetails(doctorProfileDetails)
            // setProfileImageData({ imageUrl: '', public_id: '' })
            // reset();
        }
        finally {
            setSubmitting(false);
            toast.dismiss(toastId)
        }
    }

    useEffect(() => {
        console.log("commonTimeSlots ", commonTimeSlots);
        console.log("special Slots ", specialSlots);
    }, [commonTimeSlots, specialSlots])


    const handleSlotsSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSlots = Array.from(e.target.selectedOptions, option => option.value);
        console.log("Selected values:", selectedSlots);
        setSpecialSlots(selectedSlots);
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
        console.log(" day: ", chosenDay, "slots:", specialSlots);
        if (specialSlots.length === 0 && !chosenDay) {
            toast.error("Please select the day and slots first", {
                duration:3000
            })
            return null
        }
         else if (!chosenDay) {
            toast.error('Please Select the Day First', {
                duration:3000
            });
            return null
        }
        else if(specialSlots.length === 0){
             toast.error('Please Select the Slots', {
                duration:3000
            });
            return null
        }

        if (chosenDay) {
            append({ day: chosenDay as any, slots: specialSlots })
            setSpecialSlots([]);
            setChosenDay('');
        }
        setCommonTimeSlots(COMMON_TIME_SLOTS);
        console.log("watched available days ", watchedDays)

    }

    return (
        <div className="min-h-screen flex justify-center items-start overflow-x-hidden bg-white px-2 py-3 sm:px-8 md:px-2">
            <main className="w-full max-w-2xl md:p-2 sm:p-8 bg-white rounded-lg shadow-sm">
                {/* flex-1 space-y-4 min-w-0  */}
                <form onSubmit={handleSubmit(handleFormSubmission, (formErrors) => console.log('caught errors while submitting form', formErrors))}
                    className="flex flex-col md:flex-row gap-8">
                    <div className="grid grid-cols-1 gap-5">
                        <div className="max-w-xs">
                            <UploadProfileImage imageUpload={getUploadedImage} />
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
                                        type="button"
                                        onClick={() => handleDayClicked(day)}
                                        className={`border border-gray-300 p-2 m-1 hover:bg-blue-100 ${chosenDay === (day) && '!bg-blue-300'}`}> {day}</button>
                                ))}

                                {!chosenDay && <p className="text-yellow-500"> please Select the day first</p>}


                            </div>
                            <div>
                                {chosenDay && 
                                <p className="my-1 border-b-2 border-gray-400"> Select slots for <span className="text-blue-700">{chosenDay} </span></p>
                                }
                                <div className="flex flex-wrap gap-2">
                                    {commonTimeSlots.map(time => {
                                        const isSelected = specialSlots.includes(time);
                                        return (
                                            <button
                                                key={time}
                                                type="button"
                                                onClick={() => handleSlotToggle(time)}
                                                className={`px-3 py-1 rounded-md border 
                                                        ${isSelected
                                                        ? "!bg-blue-500 text-white border-blue-600"
                                                        : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSaveSlots}
                                    className="border border-gray-300 px-4 py-2 rounded-xl hover:text-white hover:border-white !bg-blue-400 mt-1">
                                    Save Slots for {chosenDay}
                                </button>
                            </div>
                            <div className="mt-4 border-t pt-4">
                                <h4 className="text-md font-semibold">Saved Slots</h4>
                                {fields.map((field, index) => (
                                    <>
                                        <div key={field.id}>

                                            <h2 className=""> {field.day}</h2>
                                            <p> {field.slots.join(' ')}</p>

                                        </div>
                                        <button type="button" className="text-red-500" onClick={() => remove(index)}><Trash2 /></button>
                                    </>

                                ))}
                            </div>
                            {errors.availableDays?.root?.message && <p className="text-red-500">{errors.availableDays?.root?.message}</p>}

                            <button type="submit" className="px-5 py-2 !bg-red-400 rounded-2xl hover:shadow-md hover:!bg-red-500">Submit</button>
                        </div>
                    </div>
                </form>
            </main>
        </div >
    )
}

export default DoctorFormComponent

