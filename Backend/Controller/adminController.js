import mongoose from 'mongoose';
import {Admin, Doctor} from '../models/user.js';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import path from 'path';




const createDoctor = async(req,res) => {

    try{
        const {role,speciality, name, email, education, available,experience, licenseNumber, slots, permissions} = req.body.doctorInput;
        const isDoctorExist = await Doctor.findOne({email:email});
        if(isDoctorExist){
            return res.status(400).json({
                success:false,
                message:"This Doctor already exited in Database"
            })
        }
        const slotsParsed=JSON.parsed(slots);
        const permissionsParsed = JSON.parsed(permissions);
        const securedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);

        const addDoctor= new Doctor({
            username:name,
            email:email,
            password:securedPassword,
            speciality,
            experience:experience,
            education:education,
            role,
            available: available | true,
            slots:slotsParsed,
            licenseNumber,
            permissions:permissionsParsed
        })

        await addDoctor.save();
        return res.status(201).json({
            success:true,
            message:"Doctor Profile successfully Created",
            doctor:addDoctor
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Got server error while creating adding Doctor",
            err:err.message
        })
    }

 }

 const checkUpdatingFields = (allowedRoles, received) => {
    const valuesNeedsUpdation = [];
    allowedRoles.forEach((field, index) =>{
        if(received[field] !== undefined){
            valuesNeedsUpdation[field] = received[field];
        }
     }

    )
    return valuesNeedsUpdation 
 }


 const updateDoctor = async(req,res) => {
    const {id} = req.params;
    const updatedInfo = req.body;
    
    
    const allowedRoles = ['role', 'speciality', 'username', 'education', 'available', 'experience', 'licenseNumber', 'slots', 'permissions', 'email', 'password'];
     console.log("new function check Updating result: ", checkUpdatingFields(allowedRoles, req.body))
    try{
        const doctor = await Doctor.findOne({_id:id});
        if(!doctor){
            return res.status(404).json({
                success:false,
                message:"Record Not Found"
            })
        }

        const update = await Doctor.updateOne(
            {_id:id},
            {$set:{...req.body}},
            {new:true}
        )
        return res.status(201).json({
            success:true,
            message:"Doctor Profile successfully Updated",
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Got server error while creating adding Doctor",
            err:err.message
        })
    }

 }


 const manageAppointments = async(req,res) => {
    const {id} = req.params;
    const updatedInfo = req.body;
    try{
        const update = await Doctor.updateOne(
            {_id:id},
            {$set:{...req.body}},
            {new:true}
        )
        if(!allAdmins.length){
            return res.status(404).json({
                success:false,
                message:"No Admin found"
            })
        }
        return res.status(201).json({
            success:true,
            message:"Doctor Profile successfully Created",
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Got server error while creating adding Doctor",
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

 export {fetchAllAdmins, updateDoctor}