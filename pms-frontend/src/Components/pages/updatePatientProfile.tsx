import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { z } from "zod"

 const patientSchema=z.object({
        patientId:z.string().optional(),
        patientName:z.string().min(2),
        diagnosis:z.string().min(3),
        city:z.string().min(2),
        age:z.number().min(0).max(120)
    })

type PatientDataType=z.infer<typeof patientSchema>

function UpdatePatientProfile(){
    const [initialData, setInitialData] = useState({});
    const location = useLocation();
    console.log("location.state: ", location.state);
    const patientData = location.state?.[0];

    const {register, handleSubmit, formState:{errors}, reset} = useForm({
        resolver:zodResolver(patientSchema),
            defaultValues:patientData || {
                patientId:'',
                patientName:'',
                diagnosis:'',
                city:'',
                age:0
            }
        })

    
    useEffect(() => {
        if(patientData){
          reset(patientData)  
        }
    },[patientData, reset])

   function mySubmitFunction(data:PatientDataType){
    console.log("The Submit function Update Patient: ", data);
   }

    return (
        <div className="h-screen bg-gray-200 flex justify-center items-center flex flex-col ">
            <h1 className="underline decoration-blue-500 text-2xl font-bold">UPDATE PATIENT</h1>
            <form onSubmit={handleSubmit(mySubmitFunction)} className="md:max-w-2xl space-y-3 bg-white h-[80vh] px-6 py-8 rounded-md">
                <div>
                    <label htmlFor="patientName" className="block text-sm font-medium mb-1 text-gray-700">Patient Name *</label>
                    <input type="text" id="patientName" {...register('patientName')}
                     className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"/>
                    {errors.patientName && (<p className="bg-red-500 text-lg ">{errors.patientName.message?.toString()}</p>)}
                </div>
                <div>
                    <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                    <input type="text" id="diagnosis" 
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                     {...register('diagnosis')} />

                    {errors.diagnosis && <p className="">{errors.diagnosis.message?.toString()}</p>}
                </div>
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" 
                    id="city" 
                     className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    {...register('city')} 
                    />
                    {errors.city && (<p className="bg-red-500"> {errors.city.message?.toString()}</p>)}
                </div>
                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">age</label>
                    <input type="number" 
                    id="age" 
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    {...register('age')} />
                    {errors.age && (<p className="bg-red-500"> {errors.age.message?.toString()}</p>)}
                </div>

                <button type="submit" className="border border-gray-800 rounded-lg p-2">Submit</button>
            </form>
        </div>
    )
}

export default UpdatePatientProfile