import mongoose from "mongoose";
import { stringify } from "querystring";


const medicalHistorySchema= new mongoose.Schema({
    date:{
        type:String,
        default:Date.now,
        required:true,
    },
    diagnosis:{
        type:String,
        required:[true, "Diagnosis of Patient is required"]
    },
    treatment:{
        type:String,
        required:[true, "what kind of treatment initiated. Must justify "]
    }
    ,
    doctorId:{
        type:mongoose.Schema.Types.ObjectId, ref:'User'
    }
})
const patientSchema = new mongoose.Schema({
     patientId:String,
        patientName:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true,
            unique:true,
            match:[/^[0-9]{10,15}$/, "Invalid Phone Number"]
        },
        dateOfBirth:{
            type:Date,
            required:true

        },
        gender:{
            type:String,
            enum:['male', 'female', 'other']
        },
        city:String,

        medicalHistory:
        [medicalHistorySchema],
        createdBy:{
        type:mongoose.Schema.Types.ObjectId, ref:"User"
        }
}, {
    timestamps:true
})

const Patient = mongoose.model('patient', patientSchema);

export default Patient
