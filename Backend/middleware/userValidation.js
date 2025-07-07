import { body } from "express-validator";

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

const loginValidation=[
    body('email').isEmail().withMessage("You should enter valid Email address"),
    body('password').isLength({min:3}).withMessage("Password length should be atleast 8 characters long")
]
export {registerUserValidation, loginValidation};