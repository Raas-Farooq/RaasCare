import express from 'express';
import { bookAppointment, cancelAppointment, completeAppointment, fetchAllDoctors, fetchDoctorProfile } from "../Controller/doctorController.js";
import checkRole from '../middleware/checkRole.js';
import Authenticate from '../authentication/Authenticate.js';


const doctorRoutes = express.Router();

doctorRoutes.post('/cancelAppointment/:id', Authenticate, checkRole(['doctor', 'admin']), cancelAppointment);
doctorRoutes.get('/fetchAllDoctors', fetchAllDoctors);
doctorRoutes.get('/fetchDoctorProfile/:id', fetchDoctorProfile);
doctorRoutes.post('/bookAppointment/:id',Authenticate,checkRole(['patient']) ,bookAppointment)
doctorRoutes.post('/completeAppointment/:id', Authenticate, checkRole(['doctor', 'admin']), completeAppointment);

export default doctorRoutes