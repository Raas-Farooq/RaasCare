import mongoose from "mongoose";
import { isAbsolute } from "path";
import { exitCode } from "process";
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
    // ,
    // doctorId:{
    //     type:mongoose.Schema.Types.ObjectId, ref:'User'
    // }
})
const patientSchema = new mongoose.Schema({
     patientId:{
        type:String,
        default: () => Date.now().toString()
     },
        patientName:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true,
            match:[/^(\+92)[0-9]{10}$/, "Invalid Phone Number"]
        },
        dateOfBirth:{
            type:Date,
            required:true

        },
        gender:{
            type:String,
            enum:['male', 'female', 'other', 'No Answer']
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

patientSchema.index({phone:1,dateOfBirth:1}, {unique:true});

const Patient = mongoose.model('patient', patientSchema);
Patient.syncIndexes();


export default Patient




// i sent the Patient detials for adding and backend send me the Patient which is 
// successfully added.
// data
// : 
// message
// : 
// "Successfully created new Patient"
// patient
// : 
// city
// : 
// "Jakarta"
// createdAt
// : 
// "2025-07-28T01:31:23.788Z"
// dateOfBirth
// : 
// "2025-07-10T00:00:00.000Z"
// gender
// : 
// "male"
// medicalHistory
// : 
// Array(1)
// 0
// : 
// date
// : 
// "2025-07-11"
// diagnosis
// : 
// "having Tumer signs"
// treatment
// : 
// "medicine recommended"
// _id
// : 
// "6886d2eb2e9f22944148c6b0"
// [[Prototype]]
// : 
// Object
// length
// : 
// 1
// [[Prototype]]
// : 
// Array(0)
// patientId
// : 
// "1753666283650"
// patientName
// : 
// "Mushtaq Shah"
// phone
// : 
// "+923017928811"
// updatedAt
// : 
// "2025-07-28T01:31:23.788Z"
// __v
// : 
// 0
// _id
// : 
// "6886d2eb2e9f22944148c6af"

// but here from where the 2 mongoose Ids came one in the end '_id' and second of doctorId
// _id
// : 
// "6886d2eb2e9f22944148c6b0" even though i didn't login and i'm just testing it?

