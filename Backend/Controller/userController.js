import { strict } from 'assert';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import { config } from "dotenv";
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { env } from 'process';


config()

const registerPatient = async (req, res) => {
    const { isPatientExist } = req.body;
    try {
        if (isPatientExist) {
            const { patientId, username, email, role, password } = req.body;
            const hashedPassword = bcrypt.hash(password, 10);
            const addPatient = new User({
                username,
                email,
                password: hashedPassword,
                role,
                patientRecord: patientId
            })

            await addPatient.save();

            return res.status(201).json({
                success: true,
                message: "Patient registration Successfully completed ",
                patient: addPatient
            })

        } else {
            const newPatient = await Patient.create({});
            // const {patientId, patientName, city, age, gender,medicalHistory} //if in case user is being sending all the detials then we have to made some changes but in simple case when generally user register for appointement booking then the intial details is enough;
            const { username, email, role, password } = req.body;
            const hashedPassword = bcrypt.hash(password, 10);
            const addPatient = new User({
                username,
                email,
                password: hashedPassword,
                role,
                patientRecord: newPatient._id
            })

            await addPatient.save();

            return res.status(201).json({
                success: true,
                message: "New Patient Successfully Added",
                patient: addPatient
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "server error while creating new Patient",
            error: err.message
        })
    }
}
const registerUser = async (req, res) => {
    console.log("register User req.body: ", req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'got validation errors', errors

        })
    }

    try {
        const { username, email, password, role } = req.body;
        console.log(`username ${username} email ${email} pass ${password} after deconstructing`);
        const userExist = await Patient.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "user already exists",

            })
        }
        const saltRounds = 10;


        const securedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new Patient({
            username,
            email,
            password: securedPassword,
            role: role || 'patient'
        })
        const savedUser = await newUser.save();
        console.log("secret code: ", process.env.JWT_SECRET);
        let createdToken;
        try {
            createdToken = jwt.sign({ user_id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        } catch (tokenErr) {
            console.log("tokenErr: ", tokenErr);
            return res.status(400).json({
                success: false,
                message: "got error while creating token",
                error: tokenErr
            })
        }

        try {
            res.cookie('token', createdToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000
            })

        } catch (cookieErr) {
            console.log("cookieErr: ", cookieErr);
            return res.status(400).json({
                success: false,
                message: "got error while creating token",
                error: cookieErr.message
            })
        }
        return res.status(201).json({
            success: true,
            message: "Successfully added new User",
            user: {
                id: savedUser._id,
                email: savedUser.email,
                username: savedUser.username,
                role: savedUser.role
            }
        })

    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "server error while creating new user ", err
        })
    }
}

const userLogin = async (req, res) => {

    const { email, password } = req.body;


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Got validation Errors",
            errors: errors.array()
        })
    }
    try {
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(404).json({
                success: false,
                message: "User didn't exist, Email id not found"
            })
        }
        console.log("userExist value: ", userExist);
        const matchPassword = await bcrypt.compare(password, userExist.password);
        console.log("is password matched: ", matchPassword);
        if (!matchPassword) {
            return res.status(400).json({
                success: false,
                message: "Password didn't match. Try Again Later"
            })
        }
        let token;
        let expiryTime = 50 * 60;
        try {

            token = jwt.sign({ id: userExist._id, email: userExist.email, role: userExist.role }, process.env.JWT_SECRET, { expiresIn: '50m' });
            console.log("token after signing ", token);
        }
        catch (err) {
            return res.status(400).json({
                success: false,
                message: "got error while creating Token",
                error: err.message
            })
        }

        try {
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 3600000,
                path: '/'
            })
        }
        catch (err) {
            return res.status(400).json({
                success: false,
                message: "got error while Cookie creation",
                error: err.message
            })
        }
        return res.status(201).json({
            success: true,
            message: "Successfully Loged In the User",
            user: { username: userExist.username, id: userExist._id, role: userExist.role },
            token,
            expiresIn: expiryTime,
            userProfile:userExist
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error while logging the User ${err}`,
            error: err.messasge
        })
    }
}
// process.env.NODE_ENV === 'production'
const getAllUsers = async (req, res) => {

    try {
        const allUsers = await User.find({});
        if (allUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No user found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Successfully got users list",
            users: allUsers
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Got Server error while accessing all blogs",
            error: err.message
        })
    }
}
const logout = (req, res) => {

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        })
        return res.status(200).json({
            success: true,
            message: "Successfully logged out"
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while logging out",
            error: err.message
        })
    }

}

export { registerUser, userLogin, getAllUsers, logout }




// projects folder upload on idrive


//question:
