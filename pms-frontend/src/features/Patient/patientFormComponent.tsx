import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';
import { initial } from 'lodash';
import parsePhoneNumberFromString, { PhoneNumber } from 'libphonenumber-js';
import toast from 'react-hot-toast';


// Date Defintion
// dateOfBirth:z.preprocess((val) => val ? new Date(val as string): undefined,
//         z.date().max(new Date(), {
//             message:"Date of birth can't be in future"
//         }).optional())

 const patientSchema=z.object({
        patientId:z.string().optional(),
        patientName:z.string().min(2),
        phone:z.string().nonempty("Phone Must be valid 9 digit pakistani mobile number"),
        gender:z.string().min(1, "Please Select Your Gender").optional(),
        city:z.string().min(2),
        dateOfBirth:z.string().nonempty("Date Of Birth is required"),
        medicalHistory:z.array(z.object({
        treatment:z.string().min(5, "you should write meaningful statement here"),
        diagnosis:z.string().min(3).nonempty('Diagnosis details must be mentioned'),
        date:z.string().nonempty('treatment Start date must be mentioned'),
        _id:z.string().optional()
        // mongoDb _id will be assigned later when you add roles and other setup
         }))
        })

// defining the type of Patient Data
    type AddPatientFormData = z.infer<typeof patientSchema>

type FormComponentProps = {
    updating?:boolean,
    initialData?: AddPatientFormData,
    receiveSubmitData:(data: AddPatientFormData)=>Promise<void>;
}


// Patient Form Component
const FormComponent = ({initialData, receiveSubmitData}:FormComponentProps) => {
    const [submitting, setSubmitting] = useState(false);
    const [correctedPhoneNumber, setCorrectedPhoneNumber] = useState('');
    let processedInitialData;

    // useForm with Resolver definition
    const {register, control,handleSubmit, formState:{errors}, reset} = useForm<AddPatientFormData>({
        resolver: zodResolver(patientSchema),
        defaultValues: initialData || 
        {
            medicalHistory:[{date:'', diagnosis:'', treatment:''}]
        }
    })
    const {fields, append, remove} = useFieldArray(
        {
            control,
            name:'medicalHistory'
        }
    )

       useEffect(() => {
        if (initialData) {
            const formattedMedicalHistory = initialData.medicalHistory.map((entry) => ({
            ...entry,
            date: entry.date.split("T")[0], // format date for input field
            _id: entry._id, // carry this forward
            }));

            reset({
            ...initialData,
            dateOfBirth: initialData.dateOfBirth.split("T")[0],
            medicalHistory: formattedMedicalHistory,
            });
        }
}, [initialData, reset]);
    
// Form submit function 
    async function handleSubmitPatientForm(data:AddPatientFormData){
        const phoneNumber = parsePhoneNumberFromString(data.phone, 'PK');

        if (!phoneNumber || !phoneNumber.isValid()) {
            toast.error("Phone Number is not Valid");
            return;
        }
        if(!phoneNumber.number.startsWith('+923')){
            toast.error("Pakistani number Must start from +923 or 03");
            return;
        }
        const normalizedPhone = phoneNumber.number;
       
        // console.log("new patient details added: ", updatedPatientData);
            const {phone, ...restData} = data
          let updatedPatientData = {
            phone:normalizedPhone,
            ...restData
            }
            setSubmitting(true);
            try{
                await receiveSubmitData(updatedPatientData);
                // if(!initialData) reset();
            }
            finally{
                setSubmitting(false)
            }     
    }

    return (
        <section className="">
            <article className="w-full max-w-2xl rounded-lg p-6">
                
                <form onSubmit={handleSubmit(handleSubmitPatientForm, (formErrors) => console.log("got Errors from React Form", formErrors))} className="space-y-4">
                    <div>
                        <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
                            Patient Name *
                        </label>
                        <input 
                        id="patientName"
                        className="w-full px-3 py-2 border-b border-gray-400 focus:outline-none"
                        // placeholder="Enter Patient Name here"
                        {...register('patientName')}
                        />
                        {errors.patientName && <p className='text-red-500'> {errors.patientName.message?.toString()}</p> }
                    </div>
                    <div>
                        <label className='block text-gray-700' htmlFor='gender'> Gender </label>
                        <select
                        id="gender"
                        
                        {...register('gender')}
                        className="w-full px-3 py-2 border-b border-gray-400 shadow-none focus:outline-none"
                         >
                            <option className="shadow-none" value="">Select..</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>   
                            <option value="No Answer">Prefer Not To Say</option>
                        </select>
                        {errors.gender && <p className='text-red-500'> {errors.gender.message?.toString()}</p>}
                    </div>
                    <div>
                        <label className='block text-gray-700' htmlFor='DOB'> Date Of Birth *</label>
                        <input 
                        type="date"
                        id="DOB"
                        {...register('dateOfBirth')}
                       className="w-full px-3 py-2 border-b border-gray-400 focus:outline-none"
                         />
                         {errors.dateOfBirth && <p className="text-red-500">{errors.dateOfBirth.message}</p>}
                    </div>
                    <div>
                        <label className='block text-gray-700' htmlFor='phoneNO'> Enter Your Mobile Number *</label>
                        <input 
                        type="text"
                        id="phoneNO"
                        {...register('phone')}
                        className="w-full px-3 py-2 border-b border-gray-400 focus:outline-none"
                         />
                         {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <h2 className='text-xl font-bold m-2'> Medical History </h2>
                        {fields.map((field, index) => {
                            return(
                                <div key={field.id} className='space-y-2 p-2 mb-4 border'>
                                    <input
                                    placeholder="Diagnosis"
                                    {...register(`medicalHistory.${index}.diagnosis`)}
                                    className="w-full px-3 py-2 border-b border-gray-400"
                                    />
                                    {errors.medicalHistory?.[index]?.diagnosis && (
                                        <p className="text-red-500">
                                            {errors.medicalHistory[index].diagnosis?.message}
                                        </p>
                                    )}

                                    <input
                                        placeholder="Treatment"
                                        {...register(`medicalHistory.${index}.treatment`)}
                                        className="w-full px-3 py-2 border-b border-gray-400"
                                        />
                                        {errors.medicalHistory?.[index]?.treatment && (
                                            <p className="text-red-500">
                                                {errors.medicalHistory[index].treatment?.message}
                                            </p>
                                        )}
                                        <div className="relative">
                                            <input
                                                type="date"
                                                {...register(`medicalHistory.${index}.date`)}
                                                className="w-full px-3 py-2 border-b border-gray-400 appearance-none"
                                            />
                                            {!field.date && (
                                                <span className="absolute right-10 top-2 text-gray-400 pointer-events-none">
                                                When did treatment begin
                                                </span>
                                            )}
                                            </div>
                                            {errors.medicalHistory?.[index]?.date && (
                                            <p className="text-red-500">
                                                {errors.medicalHistory[index].date?.message}
                                            </p>
                                            )}
                                {/* <div>
                                    {`medicalHistory.${index}.date` ? 
                                        <span>when did treatment begin</span>
                                        :
                                        <input
                                        type="date"
                                        {...register(`medicalHistory.${index}.date`)}
                                        className="w-full px-3 py-2 border-b border-gray-400"
                                        />
                                        {errors.medicalHistory?.[index]?.date && (
                                            <p className="text-red-500">
                                                {errors.medicalHistory[index].date?.message}
                                            </p>
                                        )}
                                    }
                                    
                                </div> */}
                                
                                </div>
                            )
                        })}
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-gray-700 mb-1 font-medium text-sm">
                            City *
                        </label>
                        <input 
                            id="city"
                            {...register('city')}
                            className="w-full px-3 py-2 border-b border-gray-400 focus:outline-none"
                            placeholder="Enter the City name of Patient"
                        />
                        {errors.city && <p className="text-red-500">{errors.city.message}</p>}
                    </div>
                    <button type="submit" className="border border-gray-800 p-2 bg-red-500 rounded-lg">
                        Submit
                    </button>
                
                </form>
            </article>
        </section>
    )
}
export default FormComponent

