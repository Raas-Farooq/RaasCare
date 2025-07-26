import { MongoServerClosedError } from 'mongodb';
import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, "new User should contains username"]
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
        default:'patient'
    },
    patientRecord:{type:mongoose.Schema.Types.ObjectId, ref:'Patient'}
},
{
    timestamps:true,
    discriminatorKey:'role'
})

const User = mongoose.model('user', userSchema);

const doctorSchema = new mongoose.Schema({
    speciality:String,
    education:String,
    experience:Number,
    licenseNumber:String,
    available:{type:Boolean, default:true},
    slots:[{
        time:String,
        isBooked:{type:Boolean, default:false},
        patient_Id_backend:{type:mongoose.Schema.Types.ObjectId, ref:'User'}
    }],
    permissions:{
        type:[String],
        enum:[
            'manage_schedule',
            'view_patient_records'
        ]
    }

})

const adminSchema = new mongoose.Schema({
  department: String,
  accessLevel: { type: Number, enum: [1, 2, 3] },
  lastAccess: Date
});


const Doctor = User.discriminator('doctor',doctorSchema);
const Admin = User.discriminator('admin', adminSchema)


export {Doctor, Admin, User}






// questions:
// can we use upsert for this specific purpose 




// this is my backend controller function:
//  async function updatePatientProfile(req, res){
//     const {id} = req.params;
//     console.log("new info inside update backend ", req.body, "And Id ", id);
//     const updatedData = {...req.body};
//     console.log("updatad Data: ", updatedData);
//     try{
//         const patient = await Patient.findOne({_id:id});
//         if(!patient){
//             return res.status(401).json({
//                 success:false,
//                 message:"Patient Not found"
//             })
//         }

//         const updateProfile = await Patient.updateOne(
//             {patientId:id },
//             {$set:updatedData},
//             {new:true}
//         )
//         console.log("patient: found", patient)
//         if(updateProfile.modifiedCount !== 1){
//             return res.status(403).json({
//                 success:false,
//                 message:"Failed to Update, the error might be your data not matching with the schema",
//             })
//         }
//         return res.status(200).json({
//             success:true,
//             message:"Success.Updated!",
//             patient:updateProfile
//         })
//     }catch(err){
//         return res.status(500).json({
//             success:false,
//             message:"server error while updating Patient Profile",
//             err: err.message
//         })
//     }
//  }
// that is the patient i'm updating:
// patient: found {
// [0]   _id: new ObjectId('68748ab87610b99e5960a6fb'),
// [0]   username: 'fewaremade',
// [0]   email: 'fewaremade@gmail.com',
// [0]   password: '$2b$10$YJOF1D6g/202WU5hMvtAueaRjLDmsIUPXhqrApD0eKcmlZrAlxdLO',
// [0]   role: 'patient',
// [0]   createdAt: 2025-07-14T04:42:32.447Z,
// [0]   updatedAt: 2025-07-14T04:42:32.447Z,
// [0]   __v: 0,
// [0]   medicalHisory: []
// [0] }

// it is the updated data which i'm sending:
// [0] updatad Data:  {
// [0]   allergies: 'raisins',
// [0]   gender: 'male',
// [0]   medicalHistory: [
// [0]     {
// [0]       date: '2025-07-24T02:04:17.862Z',
// [0]       treatment: 'initial Medicines'
// [0]     }
// [0]   ]
// [0] }

// that is the schema:
// const patientProfile = new mongoose.Schema({
//     patientName:String,
//     allergies:String,
//     age:Number,
//     gender:String,
//     city:String,
//     medicalHisory:[{
//         date:Date,
//         diagnosis:String,
//         treatment:String,
//         createdBy:{type:mongoose.Schema.Types.ObjectId, ref:'User'}
//     }]
    
// }, {_id:false});

// userSchema.add({
//     patientProfile:patientProfile
// })

// doctorSchema.add({
//     createdPatient:[patientProfile]
// })

// const Doctor = User.discriminator('doctor',doctorSchema);
// const Patient = User.discriminator('patient', patientProfile);
// const Admin = User.discriminator('admin', adminSchema)


// export {Doctor, Patient, Admin, User}

// now the thing is that i didn't have those properties like allergies, gender etc in my previous schema definition when i added 'fewaremade' so i added these elements afterwards 
// so i'm trying to update the data but it might be case that those properties don't even exist in the previously added patient exp(allergies, gender) so i'm getting modified count = 0 etc but not getting any erroor message. it is just blind info i have to have some valid err message so that i can understand this is the issue ? 