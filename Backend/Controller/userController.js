import User from '../models/user.js';
import bcrypt from 'bcrypt';
import { config } from "dotenv";
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';


config()
const registerUser = async(req,res) => {
    console.log("register User req.body: ", req.body);
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:'got validation errors',errors
            
        })
    }

    try{
        const {username, email, password} = req.body;
        console.log(`username ${username} email ${email} pass ${password} after deconstructing`);
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({
                success:false,
                message:"user already exists",

            })
        }
        const saltRounds = 10;


        const securedPassword = await bcrypt.hash(password, saltRounds);
        console.log("secured password: ", securedPassword);
        const newUser = new User({
            username,
            email,
            password:securedPassword
        })
        const savedUser = await newUser.save();
        console.log("secret code: ", process.env.JWT_SECRET);
        let createToken;
        try{
            createToken = jwt.sign({user_id: savedUser._id}, process.env.JWT_SECRET, {expiresIn:'1h'});
                
        }catch(tokenErr){
            console.log("tokenErr: ", tokenErr);
            return res.status(400).json({
                success:false,
                message:"got error while creating token",
                error:tokenErr
            })
        }

         try{
             res.cookie('token', createToken, {
                httpOnly:true,
                secure:process.env.NODE_ENV === 'production',
                sameSite:'strict',
                maxAge:3600000
            })
                
        }catch(cookieErr){
            console.log("cookieErr: ", cookieErr);
            return res.status(400).json({
                success:false,
                message:"got error while creating token",
                error:cookieErr.message
            })
        }
        return res.status(201).json({
            success:true,
            message:"Successfully added new User", 
            user:{
                id:savedUser._id,
                email:savedUser.email,
                username:savedUser.username
            }
        })
        
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"server error while creating new user ",err
        })
    }
}

const userLogin = async(req,res) => {

    const {email, password} = req.body;

    try{
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(404).json({
                success:false,
                message:"User didn't exist"
            })
        }

        const matchPassword= await bcrypt.compare(password, userExist.password);

        if(!matchPassword){
            return res.status(400).message({
                success:false,
                message:"Password didn't match. Try Again Later"
            })
        }

        return res.status(201).json({
            success:true,
            message:"Successfully Loged In the User", 
            user:userExist
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Server error while logging the User",
            err:err.messasge
        })
    }
}

const getAllUsers = async(req,res) => {

    try{
        const allUsers = await User.find({});
        if(allUsers.length === 0){
            return res.status(404).json({
                success:false,
                message:"No user found",
            })
        }
        
        return res.status(200).json({
            success:true,
            message:"Successfully got users list",
            users: allUsers
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Got Server error while accessing all blogs",
            error:err.message
        })
    }
}
export {registerUser, userLogin, getAllUsers}
// projects folder upload on idrive
// ammi medison
// top room cleenliness

// the err was related to jwt not defined. now i got the success of creating the user but i'm confused how would i know that cookie has been created and where i can find it further the other thing is that what if i only create token and don't make cookie then is it useful ? 
// and the third thing is that what is the role of cookie while loggin in