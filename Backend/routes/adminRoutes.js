import express from 'express';
import { fetchAllAdmins } from '../Controller/adminController.js';
import checkRole from '../middleware/checkRole.js';
import Authenticate from '../authentication/Authenticate.js';
import UploadOnCloudinary from '../cloudinary/cloudinaryImage.js';

// import { superAdmin } from '../Controller/adminController.js';
// import { superAdmin } from '../Controller/adminController';

const adminRouter = express.Router();

adminRouter.get('/getAllAdmins',Authenticate ,checkRole(['admin']), fetchAllAdmins);
adminRouter.post('/uploadOnCloudinary', UploadOnCloudinary)

// adminRouter.post('/superAdmin', superAdmin);

export default adminRouter;