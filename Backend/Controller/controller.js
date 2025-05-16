import { validationResult } from "express-validator";
import patientModel from "../model/model.js";

// const array = [3, 8,33, 9, 73];

// const topSorting = (arr) => {
//     if(arr.length < 2){
//         return 0;
//     }
//     const mid = Math.floor(arr.length / 2);
//     let firstHalf= arr.slice(0, mid); 
//     let secondHalf =arr.slice(mid);
//     console.log("firstHalf: ", firstHalf);
//     console.log("second Half: ", secondHalf);
//     return topSorting(firstHalf), topSorting(secondHalf);
// }


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
        const {id, patientName, city, diagnosis, age} = req.body;
        const patientExist = await patientModel.find({patientId: id});
        if(patientExist){
            return res.status(400).json({
                success:false,
                message:"Patient with the same id already Exist"
            })
        }
        const newPatient= patientModel({patientId:id, patientName, city, age, diagnosis});
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

const getAllPatients= async(req,res) =>
    {
        try{
        const patients = await patientModel.find({});
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
        const patients = await patientModel.find({});

        const searching = req.query.search;
        const searchedPatients = patients.filter(patient => patient.patientName.includes(searching));
        if(!searchedPatients){
            return res.status(404).json({
                    success:false,
                    message:"Patient NOt found"
                })
        }
        return res.status(200).json({
                success:true,
                message:"Successfully created new Patient",
                searchedPatients
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
            const patientProfile = await patientModel.findById({patientId:id});
            if(!patientProfile){
                return res.status(404).json({
                    success:false,
                    message:"Patient NOt found"
                })
            }
            await patientModel.findByIdAndDelete({patientId:id});
            return res.status(200).json({
                success:true,
                message:"Successfully created new Patient",
                allPatients: patients
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
    
    try{
        const patient = await patientModel.findOne({patientId:id});
        if(!patient){
            return res.status(401).json({
                success:false,
                message:"Patient Not found"
            })
        }
        const update= await patientModel.findOneAndUpdate(
            {patientId:id}, 
            {$set:{...req.body}},
            {new:true}
        );
        if(!update){
            return res.status(403).json({
                success:false,
                message:"Failed to Update",
                err:update
            })
        }
        return res.status(200).json({
            success:true,
            message:"Success.Updated!",
            patient:update
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"server error while updating Patient Profile",
            err: err.message
        })
    }
 }

export default {AddNewPatient,updatePatientProfile, getAllPatients, deletePatientProfile, getSearchPatient}

