import { strict } from 'assert';
import { AvailableSlots, User } from '../models/user.js';
import bcrypt from 'bcrypt';
import { config } from "dotenv";
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { env } from 'process';
import Patient from '../models/patient.js';


config()

const registerPatient = async (req, res) => {
    const { username, email,password, phone} = req.body;
    const patientExist= await Patient.findOne({phone:phone});
    let patientAdded;
    try {
        if (patientExist) {
            const hashedPassword = await bcrypt.hash(password, 10);
            patientAdded = new User({
                username,
                email,
                password: hashedPassword,
                role:'patient',
                patientRecord: patientExist._id
            })
            await patientAdded.save();
        } else {
            const newPatient = await Patient.create({phone:phone});
            // const {patientId, patientName, city, age, gender,medicalHistory} //if in case user is being sending all the detials then we have to made some changes but in simple case when generally user register for appointement booking then the intial details is enough;
            console.log("username; ", username, "email , password ", email, password);
            const hashedPassword =await bcrypt.hash(password, 10);
            patientAdded = new User({
                username,
                email,
                password: hashedPassword,
                role:'patient',
                patientRecord: newPatient._id
            })

            await patientAdded.save();
        }
        console.log("patientADded after the exist process ", patientAdded);
        let token;
        const expiryTime = 60 * 60;
        try{
            token = jwt.sign({id: patientAdded._id, email:email, role:'patient'}, process.env.JWT_SECRET, {expiresIn:'1h'});
        }
        catch(error){
                console.error("got error while token Creation: ", error);
                return res.status(400).json({
                success: false,
                message: " error while creating token for New Patient",
                error: err.message
            })
        }
        console.log(" token Created ", token)
        try{
                res.cookie( 'token', token, {
                httpOnly:true,
                secure:process.env.NODE_ENV === 'production',
                sameSite:'lax',
                maxAge:3600000
            })
        }catch(cookieErr){
                console.error("got error while Cookie Creation: ", cookieErr);
                return res.status(400).json({
                success: false,
                message: " error while creating token for New Patient",
                error: cookieErr.message
            })
        }
            return res.status(201).json({
                success: true,
                message: "New Patient Successfully Added",
                user:{username, email:patientAdded.email, role:patientAdded.role},
                expiresIn:expiryTime,
                jwt_token:token,
                userProfile:patientAdded,
                patient: patientAdded
            })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "server error while creating new Patient",
            error: err.message
        })
    }
}


const userLogin = async (req, res) => {

    const { email, password } = req.body;


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Got validation Errors",
            errors: errors.array()
        })
    }
    try {
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(404).json({
                success: false,
                message: "User didn't exist, Email id not found"
            })
        }
        console.log("userExist value: ", userExist);
        let slotsBooked;
        const slotsFilter = {
             $or:[
                        {isBooked:true},
                        {isCancelled:false},
                        {isCompleted:false}
                    ]
        }
        
        if(userExist.role === 'doctor'){
            slotsBooked = await AvailableSlots.find(
                {doctorId:userExist._id, ...slotsFilter}
            ).lean();
        }
        if(userExist.role === 'admin'){
            slotsBooked = await AvailableSlots.find(
                {...slotsFilter}
            ).sort({createdAt:-1}).
            limit(10)
            .lean()
        }
        if(userExist.role === 'patient'){
            slotsBooked = await AvailableSlots.find(
                {
                    patientId:userExist._id,
                    ...slotsFilter
                },
            ).sort({createdAt:-1}).limit(5).lean()
            // console.log("slotsBooked: Patient case with explain", JSON.stringify(slotsBooked, null, 2));
            console.log("slots inside theuse controller ", slotsBooked);
        }
        const matchPassword = await bcrypt.compare(password, userExist.password);
        console.log("is password matched: ", matchPassword);
        if (!matchPassword) {
            return res.status(400).json({
                success: false,
                message: "Password didn't match. Try Again Later"
            })
        }
        let token;
        let expiryTime = 50 * 60;
        try {

            token = jwt.sign({ id: userExist._id, email: userExist.email, role: userExist.role }, process.env.JWT_SECRET, { expiresIn: '50m' });
            console.log("token after signing ", token);
        }
        catch (err) {
            return res.status(400).json({
                success: false,
                message: "got error while creating Token",
                error: err.message
            })
        }

        try {
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 3600000,
                path: '/'
            })
        }
        catch (err) {
            return res.status(400).json({
                success: false,
                message: "got error while Cookie creation",
                error: err.message
            })
        }
        return res.status(201).json({
            success: true,
            message: "Successfully Loged In the User",
            user: { username: userExist.username, id: userExist._id, role: userExist.role },
            token,
            expiresIn: expiryTime,
            userProfile:userExist,
            slotsBooked: slotsBooked.length ? slotsBooked : null
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error while logging the User ${err}`,
            error: err.messasge
        })
    }
}
// process.env.NODE_ENV === 'production'
const getAllUsers = async (req, res) => {

    try {
        const allUsers = await User.find({});
        if (allUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No user found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Successfully got users list",
            users: allUsers
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Got Server error while accessing all blogs",
            error: err.message
        })
    }
}
const logout = (req, res) => {

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        })
        return res.status(200).json({
            success: true,
            message: "Successfully logged out"
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while logging out",
            error: err.message
        })
    }

}

export { registerPatient, userLogin, getAllUsers, logout }




// projects folder upload on idrive


// Efficient Login Method:

// const userLogin = async (req, res) => {
//     const { email, password } = req.body;
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//         return res.status(400).json({
//             success: false,
//             message: "Got validation Errors",
//             errors: errors.array()
//         });
//     }

//     try {
        // Find the user and also fetch related slots in a single pipeline
        // const [userWithSlots] = await User.aggregate([
        //     // Stage 1: Find the user by email
        //     { $match: { email: email } },
        //     // Stage 2: Perform a lookup (like a join) to get the available slots
        //     {
        //         $lookup: {
        //             from: "availableslots", // The collection name in MongoDB (often pluralized by Mongoose)
        //             localField: "_id",
        //             foreignField: {
//                         $cond: {
//                             if: { $eq: ["$role", "doctor"] },
//                             then: "doctorId",
//                             else: "$$isPatient" // Fallback to a non-existent field for clarity
//                         }
//                     },
//                     as: "bookedSlots"
//                 }
//             },
//             // Stage 3: Project the final document, including the password for bcrypt
//             {
//                 $project: {
//                     username: 1,
//                     id: "$_id",
//                     role: 1,
//                     email: 1,
//                     password: 1, // Keep password for comparison
//                     userProfile: "$$ROOT", // Get the whole user document
//                     bookedSlots: {
//                         $filter: {
//                             input: "$bookedSlots",
//                             as: "slot",
//                             cond: {
//                                 $or: [
//                                     { $eq: ["$$slot.isBooked", true] },
//                                     { $eq: ["$$slot.isCancelled", true] },
//                                     { $eq: ["$$slot.isCompleted", true] }
//                                 ]
//                             }
//                         }
//                     }
//                 }
//             }
//         ]);

//         // Handle user not found case
//         if (!userWithSlots) {
//             return res.status(404).json({ success: false, message: "User didn't exist, Email id not found" });
//         }

//         // Check password
//         const matchPassword = await bcrypt.compare(password, userWithSlots.password);
//         if (!matchPassword) {
//             return res.status(400).json({ success: false, message: "Password didn't match. Try Again" });
//         }
        
//         // --- Token and Cookie Creation (your existing logic) ---
//         const token = jwt.sign({ id: userWithSlots.id, email: userWithSlots.email, role: userWithSlots.role }, process.env.JWT_SECRET, { expiresIn: '50m' });
        
//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax',
//             maxAge: 3600000,
//             path: '/'
//         });

//         // Remove sensitive password field before sending response
//         delete userWithSlots.password;

//         // Return a cleaner, more organized response
//         return res.status(201).json({
//             success: true,
//             message: "Successfully logged in the user",
//             user: { username: userWithSlots.username, id: userWithSlots.id, role: userWithSlots.role },
//             token,
//             expiresIn: 50 * 60,
//             userProfile: userWithSlots.userProfile,
//             slotsBooked: userWithSlots.bookedSlots.length ? userWithSlots.bookedSlots : null
//         });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({
//             success: false,
//             message: `Server error while logging the User`,
//             error: err.message
//         });
//     }
// }