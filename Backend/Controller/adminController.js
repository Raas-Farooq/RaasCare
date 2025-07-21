import mongoose from 'mongoose';
import {Admin} from '../models/user.js';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import path from 'path';

config({path:path.resolve(process.cwd(), '../.env')});

config();
console.log("mongoDB URI admin Cnotroller", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI).then(async() => {
    console.log("success Connection MongoDb");
}).catch(err => {
    console.log("Error while Mongoose connection ",err)
})

const superAdmin = async(req, res) => {
    const hashedPassword = await bcrypt.hash('raas$0022', 10);
    try{
        const superAdmin = await Admin.create({
        name:'Raas Ul Farooq',
        email:"raas@gmail.com",
        password:hashedPassword,
        role:'admin',
        permissions:
            [
            'manage_patients', 
            "manage_doctors",
            "view_reports",
            "system_settings"
            ]
         })

        //  return res.status(201).json({
        //     success:true,
        //     message:"Added Super Admin",
        //     superAdmin,
        //  })
        console.log("super Admin created successfully ", superAdmin);
        process.exit(0);
    }
    catch(err){
        console.log("error while creating super Admin ", err);
        process.exit(1);
        // return res.status(500).json({
        //     success:false,
        //     message:"error while creating Super Admin",
        //     error:err.message
        // })
    }
}

 const fetchAllAdmins = async(req,res) => {

    try{
        const allAdmins = await Admin.find({});
        if(!allAdmins.length){
            return res.status(400).json({
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