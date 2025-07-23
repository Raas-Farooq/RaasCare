import mongoose from 'mongoose';
import {Admin, Doctor} from '../models/user.js';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import path from 'path';


config({path:path.resolve(process.cwd(), '../.env')});

config();


mongoose.connect(process.env.MONGO_URI).then(async() => {
    console.log("success Connection MongoDb");
}).catch(err => {
    console.log("Error while Mongoose connection ",err)
})

const superAdmin = async(req, res) => {
    const hashedPassword = await bcrypt.hash('raas$0022', 10);
    const userEmail = "raas@gmail.com"
    try{
        const creatingAdmin = await Admin.create({
        username:'Raas Ul Farooq',
        email:userEmail,
        password:hashedPassword,
        role:'admin',
        lastAccess:Date(),
        permissions:
            [
            'manage_patients', 
            "manage_doctors",
            "view_reports",
            "system_settings"
            ]
         })
        console.log("super Admin created successfully ", creatingAdmin);
        process.exit(0);
    }
    catch(err){
        console.log("error while creating super Admin ", err);
        process.exit(1);
 
    }
}

// superAdmin()

const createDoctor = async(req,res) => {

    try{

        const {role, name, education, experience, license} = req.body;
        if(role !== 'admin'){
            return res.status(401).json({
                success:false,
                message:"You are not allowed to create Doctor"
            })
        }
        const addDoctor= new Doctor({
            name:name,
            experience:experience,
            education:education,
            role:'Doctor',
            available:true
        })
        await addDoctor.save();
        if(!allAdmins.length){
            return res.status(404).json({
                success:false,
                message:"No Admin found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Admins have successfully found",
            allAdmins
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Got server error while fetching all Admins",
            err:err.message
        })
    }

 }


 const fetchAllAdmins = async(req,res) => {

    try{
        const allAdmins = await Admin.find({});
        if(!allAdmins.length){
            return res.status(404).json({
                success:false,
                message:"No Admin found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Admins have successfully found",
            allAdmins
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Got server error while fetching all Admins",
            err:err.message
        })
    }

 }

 export {fetchAllAdmins}