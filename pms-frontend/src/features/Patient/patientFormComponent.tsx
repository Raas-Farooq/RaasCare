import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from "react";
import { useForm, useFieldArray, type UseFormReset} from 'react-hook-form';
import parsePhoneNumberFromString from 'libphonenumber-js';
import {toast} from "sonner";
import { patientSchema, type PatientFormType } from './patient.types';


// defining the type of Patient Data

type FormComponentProps = {
    updating?:boolean,
    initialData?: PatientFormType,
    receiveSubmitData:(data: PatientFormType, resetForm:UseFormReset<PatientFormType>)=>Promise<void>,
    
}


// Patient Form Component
const FormComponent = ({initialData, receiveSubmitData}:FormComponentProps) => {
    // useForm with Resolver definition
    const {register, control,handleSubmit, formState:{errors, isSubmitting}, watch, reset} = useForm<PatientFormType>({
        resolver: zodResolver(patientSchema),
        defaultValues: initialData || 
        {
            medicalHistory:[{date:'', diagnosis:'', treatment:''}]
        }
    })
    const {fields} = useFieldArray(
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
    async function handleSubmitPatientForm(data:PatientFormType){
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
  
            const {phone, ...restData} = data
          let updatedPatientData = {
            phone:normalizedPhone,
            ...restData
            }
            try{
                await receiveSubmitData(updatedPatientData, reset);
                // if(!initialData) reset();
            }
            finally{
                
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
                    <div className='relative'>
                        <label className='block text-gray-700' htmlFor='DOB'> Date Of Birth *</label>
                        <input 
                        type="date"
                        id="DOB"
                        {...register('dateOfBirth')}
                        
                       className="w-full px-3 py-2 border-b border-gray-400 focus:outline-none"
                         />
                         <span className='absolute right-10 top-9 text-gray-700 text-sm' >Select here</span>
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
                            const dateValue = watch(`medicalHistory.${index}.date`);
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
                                            {!dateValue && (
                                                <span className={`text-xs top-3 sm:top-2 sm:text-base absolute right-10 text-gray-400 pointer-events-none ${field.date && 'hidden'}`}>
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
                    <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="border border-gray-800 p-2 rounded-lg hover:border-purple-800 hover:text-purple-800 cursor-pointer"
                    >
                        {isSubmitting ? 'Submitting..' : 'Submit'}
                    </button>
                
                </form>
            </article>
        </section>
    )
}
export default FormComponent

