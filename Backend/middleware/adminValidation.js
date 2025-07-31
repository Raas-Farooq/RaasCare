import { body } from "express-validator"


const createDoctorValidation = [
    body('username').isString().isLength({ min: 2 }).withMessage("Username should have at least 2 characters"),
    body('password').isLength({ min: 6 }).withMessage("Password must have at least 6 characters"),
    body('email').isEmail().withMessage("Email must be in valid format"),
    body('role').isIn(['doctor']).withMessage("Role must be 'doctor'"),
    body('education').isString().isLength({ min: 2 }).withMessage("Education should have at least 2 characters"),
    body('speciality').isString().notEmpty().withMessage("Speciality must be provided"),
    body('licenseNumber').isString().notEmpty().withMessage("License number must be valid"),
    body('experience').isNumeric().withMessage("Experience in years required"),
    body('address').isString().notEmpty().withMessage("please Enter Doctor Location"),
    body('consultationFee').isNumeric().notEmpty().withMessage("consultationFee is required"),
    body('available').isBoolean().withMessage("Doctor availability status required"),
    body('slots.*.time').isString().notEmpty().withMessage("Slot time must be mentioned"),
    body('slots.*.isBooked').isBoolean().withMessage("Slot booking status required"),
    body('slots.*.patient_Id_backend').optional().isMongoId().withMessage("Patient ID must be valid"),
    body('permissions').isArray().notEmpty().withMessage("Doctor permissions must be defined")
];

export {createDoctorValidation}