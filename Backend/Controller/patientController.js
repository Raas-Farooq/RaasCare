import { validationResult } from "express-validator";
import {User} from '../models/user.js'
import Patient from "../models/patient.js";


const checkRedundantData = async(req,res) => {
    try{
            const findInvalid = await Patient.find({
            $or:[
                {phone:null},
                {dateOfBirth:null}
            ]
        })
        return res.status(200).json({
            success:true,
            message:"duplicates or invalid data: ", 
            data:findInvalid
            })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"server error while checking data redundancy",
            error:err.message
        })
    }
}


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
            return res.status(400).json({
                success:false,
                message:"Got Validation Errors",
                error: errors.array()
            })
        }  

        
        const {patientId, city, dateOfBirth, gender, medicalHistory} = req.body;
        const phone = req.body.phone.trim();
        const patientName= req.body.patientName.trim();
        const dateOfBirthISO = new Date(dateOfBirth);
        const patientExist = await Patient.findOne(
            {
                phone, dateOfBirth:dateOfBirthISO
            }
        );
        
        if(patientExist){
            return res.status(400).json({
                success:false,
                message:"Patient with the same Phone Number already Exist"
            })
        }
        const newPatient= new Patient({patientId, patientName, city, phone,dateOfBirth, gender,medicalHistory});
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
            const patient = await Patient.findOne({_id:id});
        
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

  const isMedicalHistoryMatched = (history1,history2) => {
        if(history1.length !== history2.length) return false
       return history1.every((field, index) => {
            const otherField = history2[index];
            return (
                field.date === otherField.date &&
                field.diagnosis === otherField.diagnosis &&
                field.treatment === otherField.treatment
            )
        })
    }


 async function updatePatientProfile(req, res){
    const {id} = req.params;
    console.log("new info inside update backend ", req.body, "And Id ", id);
    const receivedUserData = JSON.parse(req.body.updatedDetail);
    console.log("parsed Req Body: ", receivedUserData, "type of data ", typeof(receivedUserData));
    const updatedData = {...receivedUserData};

    const changedEntries = {}

    try{
        const existingPatient = await Patient.findOne({_id:id});
        if(!existingPatient){
            return res.status(401).json({
                success:false,
                message:"Patient Not found"
            })
        }

        console.log("existing existingPatient: ", existingPatient);
        Object.entries(receivedUserData).forEach(([key,val]) => {
            if(key === 'medicalHistory'){
                const existedMedicalHistory = existingPatient.medicalHistory;
                if(!isMedicalHistoryMatched(val, existedMedicalHistory)){
                    changedEntries[key] = val;
                }
            }
            else if(key === 'dateOfBirth'){
                const existingDOB = existingPatient.dateOfBirth.toISOString().split('T')[0];
                if(existingDOB !== val){
                    changedEntries[key] = val
                }
            }else if(existingPatient[key] !== val){
                changedEntries[key] = val;
            }
        })

        if(Object.keys(changedEntries).length === 0){
            return res.status(200).json({
                success:true,
                message:"NO changes detected"
            })
        }
        const updateProfile = await Patient.findOneAndUpdate(
            {_id:id },
            {$set:changedEntries},
            {new:true}
        )
        // console.log("result of update operation", updateProfile)
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

export default {getPatient,AddNewPatient,updatePatientProfile, getAllPatients, deletePatientProfile, getSearchPatient, checkRedundantData}
