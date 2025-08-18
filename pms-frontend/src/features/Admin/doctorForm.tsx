import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Clock, Plus, Trash2 } from 'lucide-react';
import { z } from "zod";
import UploadProfileImage from "./doctorProfileImage";



const doctorSchema = z.object({
    username: z.string().min(2, "doctor name must contains atleast 2 characters"),
    email: z.string().email().nonempty("Email should be valid "),
    password: z.string().min(6, "password must contains atleast 6 characters"),
    education: z.string().nonempty("Education of Doctor is required"),
    experience: z.coerce.number().min(0,"Experience of Doctor is required"),
    about: z.string().min(15, "About Details must not less than 15 characters"),
    speciality: z.string().nonempty("speciality is required"),
    address: z.string().nonempty("address of doctor is missing"),
    consultationFee: z.coerce.number().min(300, "consultation Fee should be atleast 300 "),
    role: z.string().nonempty("Doctor role is required"),
    slots: z.array(z.object({
        slotTime: z.string().nonempty("Slot Timing must be defined"),
        isBooked: z.boolean().default(false),
        patientId: z.string().nullable().optional()

    }))
})

type DoctorSchemaType = z.infer<typeof doctorSchema>;

const COMMON_TIME_SLOTS = [
    '9-10 AM', '10-11 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM'
];

interface ImagePayloadProps{
    imageUrl:string,
    public_id:string
}

interface DoctorFormProps {
    initialData?: DoctorSchemaType,
    receiveUpdatedDetails: (data: DoctorSchemaType) => Promise<void>
};

function DoctorFormComponent({ receiveUpdatedDetails, initialData }: DoctorFormProps) {

    const [submitting, setSubmitting] = useState(false);
    const [profileImageData, setProfileImageData] = useState({
        imageUrl:'',
        public_id:''
    });
    const [isUploading, setIsUploading] = useState(false);
    const { register, control, handleSubmit, formState: { errors }, watch, reset } = useForm({
        resolver: zodResolver(doctorSchema),
        defaultValues: initialData || {
            slots: [{ slotTime: '', isBooked: true, patientId: undefined }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'slots'
    })

    const watchedSlots = watch('slots');

    const addSlot = () => {
        append({ slotTime: '', isBooked: false })
    }

    const removeSlot = (index: number) => {
        if (fields.length > 1) {
            remove(index)
        }
    }

    const getAvailableTimeSlots = (currentIndex: number) => {
        const selectedTimes = watchedSlots
            .map((slot, index) => index !== currentIndex ? slot.slotTime : null)
            .filter(Boolean);

        return COMMON_TIME_SLOTS.filter(time => !selectedTimes.includes(time));
    };

    function getUploadedImage(imagePayload:ImagePayloadProps,imageUploading:boolean){
        console.log("imagePayload ", imagePayload, "imageUploading ", imageUploading)
        setProfileImageData(prev => ({
            ...prev,
            imageUrl:imagePayload.imageUrl,
            public_id:imagePayload.public_id
        }))
        setIsUploading(imageUploading);
      
    }

    const handleFormSubmission = async (data: DoctorSchemaType) => {
        console.log("data Received of Form Submission ", data);
        const toastId = toast.loading('Loading details');
        if(!profileImageData.imageUrl){
            toast.dismiss(toastId);
            toast.error('Profile Image is missing');
            return;
        }
        data.slots = data.slots.map(slot => ({
            slotTime:slot.slotTime,
            isBooked:slot.isBooked,
            ...(slot.patientId ? { patientId: slot.patientId } : {})
        }))
        const doctorProfileDetails = {
            profileImage:profileImageData,
            ...data
        }
        setSubmitting(true)
        try {
            await receiveUpdatedDetails(doctorProfileDetails)
            setProfileImageData({imageUrl:'', public_id:''})
            reset();
        }
        finally {
            setSubmitting(false);
            toast.dismiss(toastId)
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-start overflow-x-hidden bg-white px-2 py-3 md:px-4">
            <main className="w-full max-w-2xl p-4 sm:p-6 bg-white rounded-lg shadow-sm">
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
                    <div className="w-full flex-1 space-y-2">
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
                            className="border border-gray-800 focus:visible cursor-text w-full max-w-md" 
                            {...register('about')}
                            />
                            {errors.about && <p className="text-red-500">{errors.about?.message?.toString()}</p>}
                        </div>
                        <div>
                            <div className="border-t pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                        <Clock className="mr-2 h-5 w-5" />
                                        Available Time Slots
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={addSlot}
                                        className="flex items-center px-3 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="mr-1 h-4 w-4" />
                                        Add Slot
                                    </button>
                                </div>

                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                                        <div className="flex-1">
                                            <select
                                                {...register(`slots.${index}.slotTime` as const)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Time</option>
                                                {/* Keep current selection available */}
                                                {watchedSlots[index]?.slotTime && !getAvailableTimeSlots(index).includes(watchedSlots[index].slotTime) && (
                                                    <option value={watchedSlots[index].slotTime}>{watchedSlots[index].slotTime}</option>
                                                )}
                                                {getAvailableTimeSlots(index).map(time => (
                                                    <option key={time} value={time}>{time}</option>
                                                ))}
                                            </select>
                                            {errors.slots?.[index]?.slotTime && (
                                                <p className="text-red-500 text-sm mt-1">{errors.slots[index]?.slotTime?.message}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                {...register(`slots.${index}.isBooked` as const)}
                                                type="checkbox"
                                                className="mr-2"
                                            />
                                            <label className="text-sm text-gray-600">Booked</label>
                                        </div>

                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSlot(index)}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button type="submit"
                                disabled={isUploading}
                                className="mt-2 rounded-lg border border-gray-700 shadow-md bg-red-500 hover:bg-red-600 p-2 transition">
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div >
    )
}

export default DoctorFormComponent
