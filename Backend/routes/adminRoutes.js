import express from 'express';
import { fetchAllAdmins } from '../Controller/adminController.js';
import checkRole from '../middleware/checkRole.js';
import Authenticate from '../authentication/Authenticate.js';

// import { superAdmin } from '../Controller/adminController.js';
// import { superAdmin } from '../Controller/adminController';

const adminRouter = express.Router();

adminRouter.get('/getAllAdmins',Authenticate ,checkRole(['admin']), fetchAllAdmins);
// adminRouter.post('/superAdmin', superAdmin);

export default adminRouter;