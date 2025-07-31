import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { undefined, z } from "zod";



const doctorSchema = z.object({
    username: z.string().min(2, "doctor name must contains atleast 2 characters"),
    email: z.string().email().nonempty("Email should be valid "),
    password: z.string().min(6, "password must contains atleast 6 characters"),
    education: z.string().nonempty("Education of Doctor is required"),
    speciality: z.string().nonempty("speciality is required"),
    address: z.string().nonempty("address of doctor is missing"),
    consultationFee: z.number().min(0, "consultation Fee should be mentioned"),
    role: z.string().nonempty("Education of Doctor is required"),
    slots: z.array(z.object({
        slotTime: z.string().nonempty("Slot Timing must be defined"),
        isBooked: z.boolean(),
        _id: z.string().optional()

    }))
})

type DoctorSchemaType = z.infer<typeof doctorSchema>;

interface DoctorFormProps {
    initialData?: DoctorSchemaType,
    receiveUpdatedDetails: (data: DoctorSchemaType) => Promise<void>
};

function DoctorFormComponent({ receiveUpdatedDetails, initialData }: DoctorFormProps) {
    const [submitting, setSubmitting] = useState(false);
    const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(doctorSchema),
        defaultValues: initialData || {
            slots: [{ slotTime: '', isBooked: true, _id: '' }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'slots'
    })
    const handleFormSubmission = async (data: DoctorSchemaType) => {
        console.log("data Received of Form Submission ", data);
        const toastId = toast.loading('Loading details');
        setSubmitting(true)
        try {
            await receiveUpdatedDetails(data)
            reset();
        }
        finally {
            setSubmitting(false);
            toast.dismiss(toastId)
        }
    }

    return (
        <div className="w-screen flex justify-center items-center bg-gray-100">
            <main className="w-full max-w-sm md:max-w-xl p-6 shadow-lg bg-white">
                <form onSubmit={handleSubmit(handleFormSubmission, (formErrors) => console.log('caught errors while submitting form', formErrors))}
                    className="space-y-3">
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
                            {...register('education')}
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
                            htmlFor="education">Educational Degress Exp. MBBS, FCPS*</label>
                        <input
                            type="text"
                            {...register('education')}
                            className="border-b border-gray-700 w-full focus:outline-none px-2 py-2"
                            id="education"
                        />
                        {errors.education && <span className="text-red-700">{errors.education?.message?.toString()}</span>}
                    </div>
                    <div>
                        <label htmlFor="speciality" className="text-gray-400 block"> Speciality of Doctor *</label>
                        <input
                            type="text"
                            {...register('speciality')}
                            id="speciality"
                            className="border-b border-gray-700 w-full focus:outline-none px-2 py-2"
                        />
                        {errors.speciality && <span className="text-red-700">{errors.speciality?.message?.toString()}</span>}
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
                            type="text"
                            {...register('consultationFee')}
                            className="border-b border-gray-700 w-full focus:outline-none px-2 py-2"
                            id="consultationFee"
                        />
                        {errors.consultationFee && <span className="text-red-700">{errors.consultationFee?.message?.toString()}</span>}
                    </div>
                    <div>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex flex-col block space-y-3">
                                <input
                                    placeholder="Enter the Time of Slot"
                                    type="text"
                                    {...register(`slots.${index}.slotTime`)}
                                    className=""
                                />
                                {errors.slots && errors.slots[index]?.slotTime && <p>{errors.slots[index]?.slotTime?.message} </p>}
                                <div>
                                    <label>Yes</label>
                                    <input
                                        placeholder="is slot Booked?"
                                        value="yes"
                                        type="radio"

                                        {...register(`slots.${index}.isBooked`)}
                                    />
                                </div>
                                <div>
                                    <label>No</label>
                                    <input
                                        placeholder="is slot Booked?"
                                        value="no"
                                        type="radio"

                                        {...register(`slots.${index}.isBooked`)}
                                    />
                                </div>

                                {/* <select
                                    
                                    {...register(`slots.${index}.isBooked`)}
                                >
                                    <option value=''>Select One</option>
                                    <option value='true'>Yes</option>
                                    <option value="false">No</option>
                                </select> */}
                                {errors.slots && errors.slots[index]?.isBooked && <p>{errors.slots[index]?.isBooked?.message} </p>}
                            </div>
                        ))}
                    </div>
                    <button type="submit"
                        className="rounded-lg border border-gray-700 shadow-md bg-red-400 hover:bg-red-500 hover:p-3 p-2 transform-transition">
                        Submit
                    </button>
                </form>
            </main>
        </div>
    )
}

export default DoctorFormComponent

// how would you create Dom element for isBooked value?
// slots:z.array(z.object({
//         slotTime:z.string().nonempty("Slot Timing must be defined"),
//         isBooked:z.boolean(),
//         _id:z.string().optional()

//     }))
// as like we created for time
//     <input
//                             placeholder="Enter the Time of Slot"
//                             type="text"
//                             {...register(`slots.${index}.slotTime`)}
//                             className=""
//                         />
//                         {errors.slots && errors.slots[index]?.slotTime && <p>{errors.slots[index]?.slotTime?.message} 
// 2nd
// i'm not using append and rmove so can i remove them

// const {fields, append,remove} = useFieldArray({
//     control,
//     name:'slots'
// })

// 3rd:
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


// is this 'doctorProfileInfoType' matched to my zod doctor schema whereas here we can't have validation

// const doctorSchema = z.object({
//     username:z.string().min(2, "doctor name must contains atleast 2 characters"),
//     email:z.string().email().nonempty("Email should be valid "),
//     password:z.string().min(6, "password must contains atleast 6 characters"),
//     education:z.string().nonempty("Education of Doctor is required"),
//     speciality:z.string().nonempty("speciality is required"),
//     address:z.string().nonempty("address of doctor is missing"),
//     consultationFee:z.number().min(0, "consultation Fee should be mentioned"),
//     role:z.string().nonempty("Education of Doctor is required"),
//     slots:z.array(z.object({
//         slotTime:z.string().nonempty("Slot Timing must be defined"),
//         isBooked:z.boolean(),
//         _id:z.string().optional()

//     }))
// })