import mongoose from "mongoose";
// import {AddNewPatient} from '../Controller/controller.js';

// console.log("Add New Ptient:  model ", AddNewPatient)

const patientScehma = new mongoose.Schema({
    patientId:{
        type:String,
        required:[true, "Id is Required"]
    },
    patientName:{
        type:String,
        length:{min:3},
        requried:[true, 'Patient Name is required']
    },
    age:{
        type:String
    },
    city:{
        type:String
    },
    diagnosis:{
        type:String
    }
}, {
    timestamps:true,
    collection:'patients'
})

const patientModel = mongoose.model('patient', patientScehma);

export default patientModel