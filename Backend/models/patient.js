import mongoose from "mongoose";
import { useRef } from "react";
// import {AddNewPatient} from '../Controller/controller.js';

// console.log("Add New Ptient:  model ", AddNewPatient)

const patientScehma = new mongoose.Schema({
    patientId:{
        type:String,
        required:[true, "Id is Required"]
    },
    patientName:{
        type:String,
        minLength:3,
        required:[true, 'Patient Name is required']
    },
    age:{
        type:Number,
        min:0,
        max:120
    },
    city:{
        type:String
    },
    diagnosis:{
        type:String,
        required:[true, "Should mention Diagnosis"]
    }
}, {
    timestamps:true,
    collection:'patients'
})

patientScehma.index('patientId', 1);
// patientScehma.index('patientName', 'text');
const Patient = mongoose.model('patient', patientScehma);
export default Patient