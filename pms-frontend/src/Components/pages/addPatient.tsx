// import {zodResolver} from '@hookform/resolvers/zod';
// import axios from 'axios';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "axios";

const patientSchema = z.object({
        patientId:z.string().optional(),
        patientName:z.string().min(2, "Name is too short"),
        diagnosis:z.string().min(3),
        city:z.string().min(2),
        age:z.number().min(0).max(120)
    });
type PatientFormData = z.infer<typeof patientSchema>
const PatientForm = () => {

    const {register, handleSubmit, formState:{errors}} = useForm({
        resolver: zodResolver(patientSchema)
    })

    async function formSubmit(data:PatientFormData){

        const patientId = `${Date.now()}`;
        const updatedFormData = { patientId,...data}
        
        try{
            const response = await axios.post(`http://localhost:2500/pms/addPatientProfile`, updatedFormData);
            console.log("response: ",response);
        }
        catch(err){
            console.log('error :', err);
        }
    }

    return (
        <section className="flex justify-center items-center min-h-screen p-4">
            <article className="w-full max-w-2xl rounded-lg shadow-lg p-6">
                <h1 className="text-center text-2xl text-green-600 font-semibold mb-6">Enter The Details of New Patient</h1>
                <form onSubmit={handleSubmit(formSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
                            Patient Name *
                        </label>
                        <input 
                        id="patientName"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        // placeholder="Enter Patient Name here"
                        {...register('patientName')}
                        />
                        {errors.patientName && <p className='text-red-500'> {errors.patientName.message}</p> }
                    </div>
                  
                    <div>
                        <label htmlFor="diagnosis" className="block text-gray-700 mb-1 font-medium text-sm">
                            Diagnosis *
                        </label>
                        <input
                            className="w-full border border-gray-400 rounded-md focus:outline-none px-3 py-2 focus:ring-2 focus:ring-green-500"
                            // placeholder="Enter Patient Disease or Diagnosis"
                            id="diagnosis"
                            {...register("diagnosis")}
                        />
                        {errors.diagnosis && <p className="text-red-500">{errors.diagnosis.message}</p>}
                    </div>
                    <div>
                        
                        <label htmlFor="age" className="block text-gray-700 mb-1 font-medium text-sm">
                            Age
                        </label>
                        <input
                        type="number"
                        id="age"
                        className="w-full border border-gray-400 rounded-md focus:outline-none px-3 py-2 focus:ring-2 focus:ring-green-500"
                        {...register('age', {valueAsNumber:true})}
                        />
                        {errors.age && <p>{errors.age.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-gray-700 mb-1 font-medium text-sm">
                            City
                        </label>
                        <input 
                            id="city"
                            {...register('city')}
                            className="w-full border border-gray-400 rounded-md focus:outline-none px-3 py-2 focus:ring-2 focus:ring-green-500"
                            placeholder="Enter the City name of Patient"
                        />
                    </div>
                    <button type="submit" className="border border-gray-800 p-2 bg-red-500 rounded-lg">
                        Submit
                    </button>
                
                </form>
            </article>
        </section>
    )
}

export default PatientForm

