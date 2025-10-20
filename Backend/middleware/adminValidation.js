import { body } from "express-validator"


const createDoctorValidation = [
    body('username').isString().isLength({ min: 2 }).withMessage("Username should have at least 2 characters"),
    body('password').isLength({ min: 6 }).withMessage("Password must have at least 6 characters"),
    body('email').isEmail().withMessage("Email must be in valid format"),
    body('profileImage').isObject().withMessage("Profile Image must be an Object")
    .custom((value) => {
        if(!value.imageUrl || !value.public_id){
            throw new Error("Profile image must contain 'imageUrl' and 'public_id'");
        }
        if(typeof value.imageUrl !== 'string' || typeof value.public_id !== 'string'){
            throw new Error('image Url and Public Id both must have typeof string ')
        }
        if (!value.imageUrl.startsWith('https://res.cloudinary.com/')) {
            throw new Error('imageUrl must be a valid Cloudinary URL');
        }
        return true
    }),
    body('role').isIn(['doctor']).withMessage("Role must be 'doctor'"),
    body('education').isString().isLength({ min: 2 }).withMessage("Education should have at least 2 characters"),
    body('speciality').isString().notEmpty().withMessage("Speciality must be provided"),
    body('experience').isNumeric().withMessage("Experience in years required"),
    body('about').isString().isLength({min:10}).withMessage("About Area Should have atleat 10 characters"),
    body('address').isString().notEmpty().withMessage("please Enter Doctor Location"),
    body('consultationFee').isNumeric().notEmpty().withMessage("consultationFee is required"),
    body('availableDays')
    .isArray({min:1})
    .withMessage("There must be one day of the week"),

    body('availableDays.*.day')
    .isIn(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
    .withMessage("Day must be valid and from this list (Mon, Tue, Wed, Thu, Fri, Sat, Sun)"),
    body('availableDays.*.slots')
    .isArray({min:1})
    .withMessage("You must select atleast 1 slot"),

    body('availableDays.*.slots.*')
    .isString()
    .withMessage("slots must be in string format")
    // body('slots.*.slotTime').isString().notEmpty().withMessage("Slot time must be mentioned"),
    // body('slots.*.isBooked').isBoolean().withMessage("Slot booking status required"),
    // body('slots.*.patientId').optional().isMongoId().withMessage("Patient ID must be valid"),

];

export {createDoctorValidation}