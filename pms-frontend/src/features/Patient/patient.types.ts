import { z } from "zod"


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


export {patientSchema};
export type PatientFormType = z.infer<typeof patientSchema>