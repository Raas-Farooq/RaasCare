import { timeStamp } from "console"
import { Collection } from "mongo"


const slotSchema = new mongoose.Schema({
    time:{type:String,required:true},
    isBooked:{type:Boolean, default:false},
    patientId:{type:mongoose.Schema.Types.ObjectId, ref:'Patient'}
})


const doctorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:2
    },
    speciality:{
        type:String,
        required:[true, "speciality is required"]
    },
    education:{
        type:String,
        required:[true, "experience is required"]
    },
    experience:{
        type:Number,
        required:[true, "experience is required"]
    },
    available:{
        type:Boolean,
    },
    slots:[slotSchema],
    address:{
        type:String,
        required:[true, "city is required"]
    }

},{
    Timestamp:true,
    Collection:'doctors'
})

export default mongoose.model('doctor', doctorSchema)