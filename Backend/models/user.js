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
            slots: [{
                slotTime: String,
                isBooked: { type: Boolean, default: false },
                isCompleted: { type: Boolean, default: false },
                isCancelled: { type: Boolean, default: false },
                patientName: {type:String, default:''},
                patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
            }]
        }
    ]
    ,
    // permissions:{
    //     type:[String],
    //     enum:[
    //         'manage_schedule',
    //         'view_patient_records'
    //     ]
    // }

})

const adminSchema = new mongoose.Schema({
    department: String,
    accessLevel: { type: Number, enum: [1, 2, 3] },
    lastAccess: Date
});


const Doctor = User.discriminator('doctor', doctorSchema);
const Admin = User.discriminator('admin', adminSchema)


export { Doctor, Admin, User }
