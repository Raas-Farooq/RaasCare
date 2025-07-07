import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, "Username must be entered"]
    },
    email:{
        type:String,
        required:[true, "You can't create profile without email"]
    },
    password:{
        type:String,
        minLength:[8, "password should contain atleast 8 characters"],
        required:[true, "Password is empty"]
    },
    isPatient:{
        type:Boolean
    }
},
{
    timestamps:true,
    collection:'users'
})

const User = mongoose.model('user', userSchema);

export default User