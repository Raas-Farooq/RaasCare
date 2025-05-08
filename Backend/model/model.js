import mongoose from "mongoose";


const patientScehma = new mongoose.Schema({
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