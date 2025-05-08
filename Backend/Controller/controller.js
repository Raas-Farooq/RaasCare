import patientModel from "../model/model.js";

const AddNewPatient= async(req,res) =>
    {
    console.log("req body NeW Neural Network: ", req.body);  
    try{
        const {id, name, city, diagnosis, age} = req.body;
        const newPatient= patientModel({patientId:id, name, city, age, diagnosis});
        await newPatient.save();
        if(!newPatient){
            return res.status(403).json({
                success:false,
                message:"Failed to create new Patient"
            })
        }
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

export default AddNewPatient