import {body} from 'express-validator';

const newPatientValidation = [
    body('patientId').notEmpty().withMessage("Patient Id should be provided"),
    body('patientName').notEmpty().isLength({min:2}).withMessage("PatientName atleast contains 3 digits"),
    body('city').notEmpty().withMessage("city Name should be provided"),
    body('diagnosis').notEmpty().withMessage('Diagnosis must be Mentioned'),

    body('age').isNumeric().withMessage("age will be in string format")
]

const registerUserValidation=[
    body('username').notEmpty().isLength({min:2}).withMessage("Username atleat contains 2 characters"),
    body('email').isEmail().withMessage("You should enter valid Email Address"),
    body("password")
    .isLength({min:8})
        .withMessage("You should enter aleast 8 characters for password")
    // .matches([/A-Z/])
    //    .withMessage("password must contain atleas 1 upperCase letter")
    // .matches(/[a-z]/)
    //     .withMessage("Password must contains 1 lowercase letter")
    // .matches(/[0-9]/)
    //     .withMessage("Password Should contains 1 number")
    // .matches(/[@$!%*?&]/)
    //     .withMessage('Password must contain at least one special character')   
]

export {newPatientValidation, registerUserValidation}

