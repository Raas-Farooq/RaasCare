type Status = "available" | "booked" | "completed" | "cancelled"

export interface TimeSlots {
    slotTime: string,
    status: Status,
    _id?: string,
}
interface ProfileImage {
    imageUrl: string,
    public_id: string
}
interface AvailableDays {
    day: string,
    slots: [string]

}
interface AllDoctorInterface {
    _id: string,
    username: string,
    email: string,
    password: string,
    profileImage: ProfileImage,
    available:boolean,
    experience:number,
    availableDays:AvailableDays[],
    education: string,
    speciality: string,
    about: string,
    address: string,
    consultationFee: number,
    slots: TimeSlots[]
}
interface BookedSlotsType {
    doctorId: string,
    slotTime: string,
    status:Status,
    isArchived:boolean,
    doctorName:string,
    slotDay:string,
    source: string,
    slotDate: {
        startDate: Date,
        endDate?: Date
    },
    patientId?: string,
    patientName: string,
    _id: string,
}


export interface DoctorProfileType {
    _id?: string,
    username: string,
    email: string,
    password: string,
    education: string,
    speciality: string,
    experience: number,
    about: string,
    available?: boolean,
    address: string,
    role: string,
    consultationFee: number,
    profileImage?: ProfileImage,
    availableDays?: AvailableDays[]
}


export{type AllDoctorInterface, type BookedSlotsType}