import mongoose from 'mongoose';



const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "new User should contains username"]
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"]

    },
    password: {
        type: String,
        minLength: [8, "password should contain atleast 8 characters"],
        required: [true, "Password is empty"]
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
        default: 'patient',
        index:true
    },
    patientRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }
},
    {
        timestamps: true,
        discriminatorKey: 'role'
    })

const User = mongoose.model('user', userSchema);

const doctorSchema = new mongoose.Schema({
    profileImage: {
        imageUrl: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    speciality: String,
    education: String,
    experience: Number,
    licenseNumber: {
        type: String,
        default: () => `DOC${Date.now()}`
    },
    available: { type: Boolean, default: true },
    consultationFee: Number,
    about: String,
    address: String,
    availableDays: [
        {
            day:
            {
                type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            },
            slots: [String]
        }
    ]
})

const availableSlotsSchema = new mongoose.Schema({
    doctorId:{ type:mongoose.Schema.Types.ObjectId, ref:'Doctor', index:true},
    patientId: {type: mongoose.Schema.Types.ObjectId, ref:'User', index:true, default:null},
    slotTime:String,
    doctorName:{type:String, index:true},
    doctorSpeciality:{type:String, index:true},
    slotDate:{
        startDate:{type:Date, index:true, required:true},
        endDate:{type:Date,required:false}
    },
    slotDay:{
        type:String,
        index:true,
        required:true
    },
    slotKey:{
        type:String,
        unique:true,
        required:true,
    },
    status:{
        type:String,
        enum:['available', 'completed', 'booked', 'cancelled'],
        default:'available'
    },
    patientName:{type:String, default:''},
    isArchived:{
        type:Boolean,
        default:false,
        index:true
    },
    source:{type:String, enum:['template', 'manual'], default:'template'}
}, {
    timestamps:true
})
 
availableSlotsSchema.index({doctorId:1, slotDay:1}, {isArchived:1});


const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: {
    startDate:{type:Date, required:true},
    endDate:{type:Date, required:false}
  }, // The actual day (like Fri, Aug 30, 2025)
  time: String, // "09:00"
  status: { type: String, enum: ['booked','cancelled','completed'], default: 'booked' }
});




const adminSchema = new mongoose.Schema({
    department: String,
    accessLevel: { type: Number, enum: [1, 2, 3] },
    lastAccess: Date
});


const Doctor = User.discriminator('doctor', doctorSchema);
const Admin = User.discriminator('admin', adminSchema)
const AvailableSlots = mongoose.model('availableSlots', availableSlotsSchema);
const Appointments = mongoose.model('appointments', appointmentSchema);


export { Doctor, Admin, User, AvailableSlots, Appointments}



//a)
//   const startDate = new Date();
//     startDate.setHours(0, 0, 0, 0);
//     try {
//         const pipeline = [
//             { $match: { doctorId: new ObjectId(docId), "slotDate.startDate": { $gte: startDate }, status:'available' | 'cancelled' | 'booked' | 'completed', isArchived:false } },
//             {
//                 $project: {
//                     slotDate: 1,
//                     slotTime: 1,
//                     status:1,
//                     dayStr: { $dateToString: { format: "%Y-%m-%d", date: '$slotDate.startDate', timezone: "Asia/Karachi" } }
//                 },
//             },
//             {
//                 $group: {
//                     _id: "$dayStr",
//                     date: { $first: "$slotDate.startDate" },
//                     slots:{$addToSet:{slotId: "$_id", slotTime:"$slotTime", status:"$status"}}
//                     // slots: { $push: { slotId: "$_id", slotTime: "$slotTime", isBooked:"$isBooked" } }
//                 }
//             },
//             { $sort: { date: 1 } }
//             this is the controller function which provides us the latest doctor slots available when the doctor profile is clicked and from this aggregation i'm sending the latest slots
//             these are the changes i made inside aggregation, and i'm still comparing '"slotDate.startDate": { $gte: startDate }' here instead of slotDay what do you think, we can simply compare day as well? 
// b: i have added slotId inside the addToSet since i'm managing (booking and cancelling slots) all the frontend Process through that id what would you say since you didn't include that (//  slots:{$addToSet:{slotId: "$_id", slotTime:"$slotTime", status:"$status"}}
                    // slots: { $push: { slotId: "$_id", slotTime: "$slotTime", isBooked:"$isBooked" } }).
// booking logic now:
// backend
// const bookSlot = async (req, res, next) => {
//     const { slotId } = req.params;
//     const { patientName, docId, patientId } = req.body;
//         try {
//         const slot = await AvailableSlots.findOneAndUpdate(
//             { _id: slotId, status: "available" },
//             {
//                 $set: {
//                     status: 'booked',
//                     patientName,
//                     patientId,
//                 }
//             },
//             {
//                 new: true
//             }
//         )

//         if (!slot) return res.status(400).json("Slot is Not Available")
// fronend:
// const handleSlotSelection = (id: string, status:Status) => {
//         if(status !== 'available'){
//             toast.warning('This slot is not available, Please select another one')
//         }
//         if(status === 'available'){
//             setSelectedSlot_id(id);
//         }
    
//     }
{/* <div>
                                        {(!slotsLoading && doctorSlotsAvailable?.length) ? doctorSlotsAvailable.map((day, index) => (

                                            <div className="flex flex-wrap" key={index}>
                                                {dayId === day._id && day.slots?.map((slot, slotIndex) => (
                                                    <button key={slotIndex} onClick={() => handleSlotSelection(slot.slotId, status)}// ()
                                                    className={`            
                                                        m-3 text-xs py-2 w-24 rounded-xl shadow-md
                                                        bg-blue-100
                                                        hover:shadow-lg 
                                                        ease-out
                                                        opacity-0 animate-fade-in
                                                    
                                                    ${((slot.status === 'available') && selectedSlot_id === slot.slotId) ? 'bg-green-400' : 'hover:bg-blue-100'}
                                                    ${slot.status === "booked" && '!bg-gray-400 hover:bg-gray-400 disabled cursor-not-allowed'} 
                                                    `}
                                                    // or what about doing slot.status !== "available" then cross the slot means if it is booked or cancelled or completed but i think most efficient will be is to display booked differently as compare to cancelled or completed
                                                        style={{ animationDelay: `${slotIndex * 50}ms` }}
                                                    >
                                                        {slot.slotTime}
                                                    </button>
                                                ))}
                                            </div> */}

//  try {

//             const response = await axios.post(`${backendUrl}/pms/bookSlot/${selectedSlot_id}`,
//                 {
//                     docId: localStoredDoctorId,
//                     patientId: storedUser.user.id,
//                     patientName: storedUser.user.username

//                 },
//                 {
//                     withCredentials: true
//                 }
//             )

// 8️⃣ FINAL canonical queries (copy-paste safe)
// Fetch slots for booking
// AvailableSlots.find({
//   doctorId,
//   isArchived: false,
//   status: "available",
//   "slotDate.startDate": { $gte: new Date() }
// })

// Archive past slots (CRON / startup job)
// const today = new Date().toISOString().split("T")[0];

// await AvailableSlots.updateMany(
//   {
//     slotDay: { $lt: today },
//     isArchived: false
//   },
//   {
//     $set: {
//       status: "completed",
//       isArchived: true
//     }
//   }
// );





// isArchieved:false is not being found while logging in -> doctor or admin