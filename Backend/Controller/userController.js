import { userModel } from "../model/model";

const registerUser = async(req,res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:'got validation errors', 
            
        })
    }

    try{
        const {username, email, password} = req.body();

        const user = await userModel.findOne({email:email});
        if(user){
            return res.status(400).json({
                success:false,
                message:"user already exists",

            })
        }

        const securedPassword = (password, 10);

        const newUser = {
            username,
            email,
            securedPassword
        }
        const addNewUser = await newUser.save();
        return res.status(201).json({
            success:true,
            message:"Successfully added new User", 
            newUser
        })
        
    }
    catch(err){

    }
}

// projects folder upload on idrive
// ammi medison
// top room cleenliness
