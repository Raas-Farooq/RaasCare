import express from 'express';
import { fetchAllAdmins } from '../Controller/adminController.js';
// import { superAdmin } from '../Controller/adminController.js';
// import { superAdmin } from '../Controller/adminController';

const adminRouter = express.Router();

adminRouter.get('/getAllAdmins', fetchAllAdmins);
// adminRouter.post('/superAdmin', superAdmin);

export default adminRouter;