import { MongoServerClosedError } from 'mongodb';
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
        default: 'patient'
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
    isCancelled:{type:Boolean, default:false},
    isCompleted:{type:Boolean, default:false},
    isBooked:{type:Boolean, default:false, index:true},
    patientName:{type:String, default:''},
    source:{type:String, enum:['template', 'manual'], default:'template'}
}, {
    timestamps:true
})
 
availableSlotsSchema.indexes({doctorId:1, slotDate:1, patientId:1}, {unique:true});
availableSlotsSchema.indexes({patientId:1, isBooked:1});

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


