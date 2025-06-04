import {body} from 'express-validator';

const newPatientValidation = [
    body('patientId').notEmpty().withMessage("Patient Id should be provided"),
    body('patientName').notEmpty().isLength({min:2}).withMessage("PatientName atleast contains 3 digits"),
    body('city').notEmpty().withMessage("city Name should be provided"),
    body('diagnosis').notEmpty().withMessage('Diagnosis must be Mentioned'),

    body('age').isString().withMessage("age will be in string format")
]


export {newPatientValidation}

