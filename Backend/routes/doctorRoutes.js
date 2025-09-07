import express from 'express';
import { bookAppointment, fetchAllDoctors, fetchDoctorProfile, handleAppointmentAction } from "../Controller/doctorController.js";
import checkRole from '../middleware/checkRole.js';
import Authenticate from '../authentication/Authenticate.js';


const doctorRoutes = express.Router();

// doctorRoutes.post('/cancelAppointment/:id', Authenticate, checkRole(['doctor', 'admin']), cancelAppointment);
doctorRoutes.get('/fetchAllDoctors', fetchAllDoctors);
doctorRoutes.get('/fetchDoctorProfile/:id', fetchDoctorProfile);
doctorRoutes.post('/bookAppointment/:id',Authenticate,checkRole(['patient']) ,bookAppointment)
doctorRoutes.post('/handleAppointmentAction/:id', Authenticate, checkRole(['doctor', 'admin']), handleAppointmentAction);

export default doctorRoutes