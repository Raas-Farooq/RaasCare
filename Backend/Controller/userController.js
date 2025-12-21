import { strict } from 'assert';
import { AvailableSlots, User } from '../models/user.js';
import bcrypt from 'bcrypt';
import { config } from "dotenv";
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { env } from 'process';
import Patient from '../models/patient.js';
import { isCancel } from 'axios';
import mongoose, { mongo } from 'mongoose';


config()

const registerPatient = async (req, res, next) => {
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

        try{
                res.cookie( 'token', token, {
                httpOnly:true,
                secure:process.env.NODE_ENV === 'production',
                sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'lax',
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
           next(err);
    }
}


const userLogin = async (req, res,next) => {

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
        const today = new Date();
        today.setUTCHours(0,0,0,0);
        let slotsBooked;
        
        const slotsFilter = {
             status:{$in:["booked","completed","cancelled"]}
        }
        
        
        if(userExist.role === 'doctor'){
            slotsBooked = await AvailableSlots.find(
                {
                    doctorId:(userExist._id),
                     ...slotsFilter,
                    'slotDate.startDate':{$gte:today}}
            ).lean().sort({updatedAt:-1});
        }
        if(userExist.role === 'admin'){
            slotsBooked = await AvailableSlots.find(
                {
                    ...slotsFilter,
                    'slotDate.startDate':{$gte:today}
                }
            ).sort({updatedAt:-1}).
            limit(10)
            .lean()
        }
        if(userExist.role === 'patient'){
   
            slotsBooked = await AvailableSlots.find(
                {
                    patientId:userExist._id,
                    ...slotsFilter,
                    'slotDate.startDate':{$gte:today}
                },
            ).sort({updatedAt:-1}).limit(5).lean()
            // console.log("slotsBooked: Patient case with explain", JSON.stringify(slotsBooked, null, 2));
        }
        const matchPassword = await bcrypt.compare(password, userExist.password);
        if (!matchPassword) {
            return res.status(400).json({
                success: false,
                message: "Password didn't match. Try Again Later"
            })
        }
        let token;
        let expiryTime = 60 * 60;
        try {

            token = jwt.sign({ id: userExist._id, email: userExist.email, role: userExist.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

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
                sameSite: process.env.NODE_ENV === 'production'? 'none' : 'lax',
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
        next(err)
    }
}
// process.env.NODE_ENV === 'production'
const getAllUsers = async (req, res, next) => {

    try {
        const allUsers = await User.find({role:'patient', patientRecord:{$exists:true}});
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
         next(err)
    }
}
const logout = (req, res, next) => {

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
         next(err)
    }

}

export { registerPatient, userLogin, getAllUsers, logout }




// projects folder upload on idrive


