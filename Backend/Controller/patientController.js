import { validationResult } from "express-validator";
import {patientModel, userModel} from "../model/model.js";


const AddNewPatient= async(req,res) =>
    {
       
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
        const {patientId, patientName, city, diagnosis, age} = req.body;
        const patientExist = await patientModel.findOne({patientId});
        
        if(patientExist){
            return res.status(400).json({
                success:false,
                message:"Patient with the same id already Exist"
            })
        }
        const newPatient= patientModel({patientId, patientName, city, diagnosis,age});
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
            const patient = await patientModel.findOne({patientId:id});
        
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
        const patients = await patientModel.find({});
        // await patientModel.insertMany([{
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
        // const patients = await patientModel.find({});

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
        searchedPatients = await patientModel.find({
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
                message:"Successfully created new Patient",
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
            const patientProfile = await patientModel.findOneAndDelete({patientId:id});
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


 async function updatePatientProfile(req, res){
    const {id} = req.params;
    console.log("new info inside update backend ", req.body, "And Id ", id);
    const updatedDetail = JSON.parse(req.body.updatedDetail);

    try{
        const patient = await patientModel.findOne({patientId:id});
        if(!patient){
            return res.status(401).json({
                success:false,
                message:"Patient Not found"
            })
        }
        const updateProfile = await patientModel.updateOne(
            {patientId:id },
            {$set:updatedDetail},
            {new:true}
        )
        console.log("patient: found", patient)
        // const update= await patientModel.findOneAndUpdate(
        //     {patientId:id}, 
        //     {$set:{...req.body}},
        //     {new:true}
        // );
        if(updateProfile.modifiedCount !== 1){
            return res.status(403).json({
                success:false,
                message:"Failed to Update",
                err:update
            })
        }
        return res.status(200).json({
            success:true,
            message:"Success.Updated!",
            // patient:update
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