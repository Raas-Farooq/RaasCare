import express from 'express';
import { createDoctor, fetchAllAdmins } from '../Controller/adminController.js';
import checkRole from '../middleware/checkRole.js';
import Authenticate from '../authentication/Authenticate.js';
import UploadOnCloudinary from '../cloudinary/cloudinaryImage.js';
import upload from '../cloudinary/multerConfig.js';
import { createDoctorValidation } from '../middleware/adminValidation.js';

// import { superAdmin } from '../Controller/adminController.js';
// import { superAdmin } from '../Controller/adminController';

const adminRouter = express.Router();

adminRouter.get('/getAllAdmins',Authenticate ,checkRole(['admin']), fetchAllAdmins);
adminRouter.post('/uploadOnCloudinary',upload.single('image'), UploadOnCloudinary);
adminRouter.post('/createDoctor', createDoctorValidation, createDoctor)

// adminRouter.post('/superAdmin', superAdmin);

export default adminRouter;