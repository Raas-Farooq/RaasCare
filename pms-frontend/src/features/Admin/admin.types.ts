import { z } from "zod";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const daysEnum = z.enum(daysOfWeek);
const DaysAndSlots = z.array(z.object({
    day: daysEnum,
    slots: z.array(z.string()).min(1, "Atleast 1 slot must be selected")
}))
const doctorFormSchema = z.object({
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

interface ProfileImageProps {
    imageUrl: string,
    public_id: string
}


export {doctorFormSchema, type ProfileImageProps}
export type DoctorSchemaType = z.infer<typeof doctorFormSchema>;
export type TimeAndSlots = z.infer<typeof DaysAndSlots>[number];
export type DayType = z.infer<typeof daysEnum>;
