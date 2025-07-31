import mongoose from 'mongoose';
import {Admin, Doctor} from '../models/user.js';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import path from 'path';




const createDoctor = async(req,res) => {

    try{
        const {role,speciality, profileImage,username, password, email, education, available,experience,address, consultationFee, licenseNumber, slots, permissions} = req.body.doctorInput;
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
            username,
            email:email,
            password:securedPassword,
            profileImage,
            speciality,
            address,
            consultationFee,
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

 const checkSlotsFields = (fields1, fields2) => {
    if(fields1.length !== fields2.length) return false;

    return fields1.every((item, index) => {
        const otherItem = fields2[index];

        return(
            otherItem.time !== item.time &&
            otherItem.isBooked !== item.isBooked
        )
    })
 }


 const updateDoctor = async(req,res) => {
    const {id} = req.params;
    const updatedInfo = req.body;
    const changedValues = {};
    try{
        const existingDoctor = await Doctor.findOne({_id:id});
        if(!existingDoctor){
            return res.status(404).json({
                success:false,
                message:"Doctor Not Found"
            })
        }


        Object.entries(updatedInfo).forEach(([key, value]) => {
            if(existingDoctor[key] === 'slots'){
                if(!checkSlotsFields){
                    changedValues[key] = value
                }
            }
            else if (existingDoctor[key] !== value){
                changedValues[key] = value
            }
        })

        if(Object.keys(changedValues).length === 0){
            return res.status(200).json({
                success:false,
                message:"No change Detected"
            })
        }
        const update = await Doctor.findOneAndUpdate(
            {_id:existingDoctor._id},
            {$set:{changedValues}},
            {new:true}
        )
        return res.status(201).json({
            success:true,
            message:"Doctor Profile successfully Updated",
            newProfile:update
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Got server error while creating adding Doctor",
            err:err.message
        })
    }

 }

 // manage Bookings like cancel or change the timings

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

 export {fetchAllAdmins, createDoctor, updateDoctor}