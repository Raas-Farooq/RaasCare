import { validationResult } from "express-validator";
import {User} from '../models/user.js'
import Patient from "../models/patient.js";

const checkPatientExistence = async(req, res) => {
    let isPatientExist;
    console.log("req body: ", req.body);
    const {phone} = req.body;
    try{
        if(!phone){
        return res.status(400).send("Phone Number is required the one you gave when you visited the doctor")
        }
        isPatientExist = await Patient.find({phone:phone});
        if(!isPatientExist){
            return res.status(404).json({
                success:false,
                message:"No record found for this patient"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Patient Successfully found",
            patient:isPatientExist._id
        })
        
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"server error while checking the existence of patient",
            error:err.message
        })
    }
}
const AddNewPatient= async(req,res) =>
    {
    let isPatientExist;
    console.log("req body NeW Neural Network: ", req.body);
    
    try{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(401).json({
                success:false,
                message:"Got Validation Errors",
                error: errors.array()
            })
        }  

        
        const {patientId, patientName, city, age, gender, medicalHistory} = req.body;
        const patientExist = await Patient.findOne({patientId});
        
        if(patientExist){
            return res.status(400).json({
                success:false,
                message:"Patient with the same id already Exist"
            })
        }
        const newPatient= new Patient({patientId, patientName, city, age, gender,medicalHistory});
        console.log("newPatient: ", newPatient)
        await newPatient.save();
        return res.status(201).json({
            success:true,
            message:"Successfully created new Patient",
            patient:newPatient
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"server error while creating new Patient",
            error:err.message
        })
    }
}

const getPatient= async(req,res) =>
    {
        try{
            console.log("Single Patient Runs")
            const id = req.params.id;
            console.log("id received: ", id);
            const patient = await Patient.findOne({patientId:id});
        
            console.log("get all Patients: runs ");
            if(!patient){
                return res.status(404).json({
                    success:false,
                    message:"No Patient Data found"
                })
        }
        return res.status(201).json({
            success:true,
            message:"Successfully created new Patient",
            patient
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"server error while creating new Patient",
            error:err.message
        })
    }
}

const getAllPatients= async(req,res) =>
    {
        try{
        const patients = await Patient.find({});
        // await Patient.insertMany([{
        //     patientId:'235',
        //     patientName:"Rehmat Ali",
        //     age:'54',
        //     city:'Lahore',
        //     diagnosis:'Typhoid'
        // }])
        console.log("get all Patients: runs ");
        if(!patients){
            return res.status(404).json({
                success:false,
                message:"No Patient Data found"
            })
        }
        return res.status(201).json({
            success:true,
            message:"Successfully created new Patient",
            allPatients: patients
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"server error while creating new Patient",
            error:err.message
        })
    }
}

const getSearchPatient = async(req,res) =>{
    try{
        const searchTerm = req.query.search?.trim() || "";
        console.log(": Type", typeof(searchTerm), "length of searchTerm: ", searchTerm.length, "searchTerm ", searchTerm);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit
        let searchedPatients;
        // const searchedPatients = patients.filter(patient => patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()));
        if(!searchTerm || searchTerm.trim() === ""){
             return res.status(400).json({
                success:false,
                message:"Please Enter Patient Name"
            })
        }
        searchedPatients = await Patient.find({
                $or:[
                    {patientId:searchTerm},
                    {patientName:{$regex:searchTerm, $options:'i'}},
                    {patientId:{$regex:searchTerm, $options:'i'}},
                ]     
        }).skip(skip).limit(limit);
        console.log("searchPatiens length: ", searchedPatients.length)
        if(searchedPatients.length === 0){
            console.log("length === 0 sent success fasle")
            return res.status(404).json({
                    success:false,
                    message:"Patient NOt found"
                })
        }
        return res.status(200).json({
                success:true,
                message:"Successfully found the Patient",
                patients: searchedPatients
            })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"server error while finding Patient",
            error:err.message
        })
    }
}
async function deletePatientProfile(req,res)
    {
        try{
            console.log("delte PATIENT PROFILE IS BEING RUN")
            const {id} = req.params;
            console.log("id: ", typeof(id));
            const patientProfile = await Patient.findOneAndDelete({patientId:id});
            if(!patientProfile){
                return res.status(404).json({
                    success:false,
                    message:"Patient NOt found"
                })
            }
        
            return res.status(200).json({
                success:true,
                message:"Successfully Deleted Patient",
                deletedPatient: patientProfile
            })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"server error while deleting Patient",
            error:err.message
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
 async function updatePatientProfile(req, res){
    const {id} = req.params;
    console.log("new info inside update backend ", req.body, "And Id ", id);
    const parsedReqBody = JSON.parse(req.body.updatedDetail);
    console.log("parsed Req Body: ", parsedReqBody);
    const updatedData = {...parsedReqBody};
    console.log("updatad Data: ", updatedData);
    try{
        const patient = await Patient.findOne({_id:id});
        if(!patient){
            return res.status(401).json({
                success:false,
                message:"Patient Not found"
            })
        }

        const updateProfile = await Patient.findOneAndUpdate(
            {_id:id },
            {$set:updatedData},
            {new:true}
        )
        console.log("result of update operation", updateProfile)
        // if(updateProfile.modifiedCount !== 1){
        //     return res.status(403).json({
        //         success:false,
        //         message:"Failed to Update, the error might be your data not matching with the schema",
        //     })
        // }
        return res.status(200).json({
            success:true,
            message:"Success.Updated!",
            patient:updateProfile
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"server error while updating Patient Profile",
            err: err.message
        })
    }
 }

export default {getPatient,AddNewPatient,updatePatientProfile, getAllPatients, deletePatientProfile, getSearchPatient}

// if(searchedPatients.length === 0){
//             return res.status(404).json({
//                     success:false,
//                     message:"Patient NOt found"
//                 })
//         }
//         why are you using 'patients.length' instead of !patients