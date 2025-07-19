import { MongoOIDCError } from "mongodb";
import mongoose from "mongoose";
import { permission } from "process";




const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Admin name is required"]
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        trim:true,
        lowercase:[true,"Email should be in lowercase letters"],
        match:[/.+\@.\..+/, "Email should be in valid format"]
    },
    password:{
        type:String,

        required:[true, "password is required"],
        minLength:[6, "password length must be atleast 6 letters long"],

    },
    role:{
        type:String,
        defualt:['admin'],
        enum:[
            'admin'
        ]
    },
    permissions:{
        type:[String],
        default:["manage_doctors", "manage_patients", 'view_reports'],
        enum:[
            "manage_doctors",
            "manage_patients",
            "view_reports",
            "system_settings"
        ]
    },
    lastLogin:{
        type:Date
    },
    isActive:{
        type:Boolean,
        default:true
    }
}, {
    timestamps:true
})

const Admin = mongoose.model('admins', adminSchema);

export default Admin