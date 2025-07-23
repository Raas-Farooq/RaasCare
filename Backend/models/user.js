import { MongoServerClosedError } from 'mongodb';
import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, "Username must be entered"]
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"]

    },
    password:{
        type:String,
        minLength:[8, "password should contain atleast 8 characters"],
        required:[true, "Password is empty"]
    },
    role:{
        type:String,
        enum:['patient', 'doctor', 'admin'],
        // default:'patient'
    }
},
{
    timestamps:true,
    discriminatorKey:'role'
})

const User = mongoose.model('user', userSchema);

const doctorSchema = {
    speciality:String,
    education:String,
    experience:Number,
    licenseNumber:String,
    available:{type:Boolean, default:true},
    slots:[{
        time:String,
        isBooked:{type:Boolean, default:false},
        patientId:{type:mongoose.Schema.Types.ObjectId, ref:'User'}
    }],
    permissions:{
        type:[String],
        enum:[
            'manage_schedule',
            'view_patient_records'
        ]
    }

}

const adminSchema = new mongoose.Schema({
  department: String,
  accessLevel: { type: Number, enum: [1, 2, 3] },
  lastAccess: Date
});

const patientProfile = new mongoose.Schema({
    patientName:String,
    allergies:String,
    age:Number,
    gender:String,
    city:String,
    medicalHisory:[{
        date:Date,
        diagnosis:String,
        treatment:String,
        createdBy:{type:mongoose.Schema.Types.ObjectId, ref:'User'}
    }]
    
}, {_id:false});

userSchema.add({
    patientProfile:patientProfile
})

// doctorSchema.add({
//     createdPatient:[patientProfile]
// })

const Doctor = User.discriminator('doctor',doctorSchema);
const Patient = User.discriminator('patient', patientProfile);
const Admin = User.discriminator('admin', adminSchema)


export {Doctor, Patient, Admin, User}


// questions:
// can we use upsert for this specific purpose 