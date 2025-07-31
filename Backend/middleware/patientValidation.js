import {body} from 'express-validator';

const newPatientValidation = [
    body('patientName').isString().isLength({min:2}).notEmpty().isLength({min:2}).withMessage("PatientName atleast contains 3 digits"),
    body('city').isString().notEmpty().withMessage("city Name should be provided"),
    body('medicalHistory').isArray({min:1}).notEmpty().withMessage('Diagnosis must be Mentioned'),
    body('medicalHistory.*.diagnosis').notEmpty().withMessage("Diagnosis must be provided"),
    body('medicalHistory.*.treatment').notEmpty().withMessage("Treatment details Should be Provided"),
    body('medicalHistory.*.diagnosis').notEmpty().withMessage("Diagnosis must be provided"),
    body("gender").isString(),
    body('phone').isString().notEmpty().withMessage("Phone Number must Required"),
    body('dateOfBirth').isString().withMessage("age will be in string format")
]
// .isISO8601.withMessage("Date must be valid (ISO 8601 format)")

export {newPatientValidation}



