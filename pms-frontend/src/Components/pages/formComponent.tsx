import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';
import { initial } from 'lodash';



// Date Defintion
// dateOfBirth:z.preprocess((val) => val ? new Date(val as string): undefined,
//         z.date().max(new Date(), {
//             message:"Date of birth can't be in future"
//         }).optional())

 const patientSchema=z.object({
        patientId:z.string().optional(),
        patientName:z.string().min(2),
        phone:z.string(),
        diagnosis:z.string().min(3),
        gender:z.string().min(1, "Please Select Your Gender").optional(),
        treatment:z.string().min(5, "you should write meaningful statement here"),
        date:z.string(),
        city:z.string().min(2).optional(),
        dateOfBirth:z.string().optional(),
    })


// defining the type of Patient Data
    type PatientFormData = z.infer<typeof patientSchema>
type FormComponentProps = {
    initialData?: PatientFormData,
    receiveSubmitData:(data: PatientFormData)=>Promise<void>;
}


// Patient Form Component
const FormComponent = ({initialData, receiveSubmitData}:FormComponentProps) => {
    const [submitting, setSubmitting] = useState(false);

    // useForm with Resolver definition
    const {register, handleSubmit, formState:{errors}, reset} = useForm<PatientFormData>({
        resolver: zodResolver(patientSchema),
        defaultValues: initialData || {}
    })

    // useEffect(() => {
    // console.log("intialData: ", initialData)
    // },[])
// Form submit function 
    async function handleSubmitPatientForm(data:PatientFormData){
        alert("Submit clicked")
        console.log("data: ",data);
        const patientId = `${Date.now()}`;
        const updatedFormData= {
            patientId,
            ...data
        }

        console.log("new patient details added: ", updatedFormData);
        // setSubmitting(true);
        // try{
        //     await receiveSubmitData(updatedFormData);
        //     if(!initialData) reset();
        // }
        // finally{
        //     setSubmitting(false)
        // }
        
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
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>   
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
                        <label className='block text-gray-700' htmlFor='phoneNO'> Enter Phone Number without Dashes *</label>
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
                        <div>
                            <label htmlFor="diagnosis" className="block text-gray-700 mb-1 font-medium text-sm">
                                Diagnosis *
                            </label>
                            <input
                                className="w-full px-3 py-2 border-b border-gray-400 focus:outline-none"
                                // placeholder="Enter Patient Disease or Diagnosis"
                                id="diagnosis"
                                {...register("diagnosis")}
                            />
                            {errors.diagnosis && <p className="text-red-500">{errors.diagnosis.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="treatment" className="block text-gray-700 mb-1 font-medium text-sm">
                                Treatment *
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border-b border-gray-400 focus:outline-none"
                                // placeholder="Enter Patient Disease or Diagnosis"
                                id="treatment"
                                {...register("treatment")}
                            />
                            {errors.treatment && <p className="text-red-500">{errors.treatment.message}</p>}
                        </div>
                         <div>
                            <label htmlFor="startDate" className="block text-gray-700 mb-1 font-medium text-sm">
                                When treatment Started *
                            </label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border-b border-gray-400 focus:outline-none"
                                // placeholder="Enter Patient Disease or Diagnosis"
                                id="startDate"
                                {...register("date")}
                            />
                            {errors.date && <p className="text-red-500">{errors.date.message}</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-gray-700 mb-1 font-medium text-sm">
                            City
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