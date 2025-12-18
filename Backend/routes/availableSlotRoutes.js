import express from 'express';
import { bookSlot, generateNewDoctorSlots, getDoctorAvailableDays, getDoctorSlots, updateSlotStatus } from '../Controller/slotsController.js';
import Authenticate from '../authentication/Authenticate.js';
const slotsRoutes = express.Router();


slotsRoutes.post('/generateNewDoctorSlots', generateNewDoctorSlots);
slotsRoutes.post('/bookSlot/:slotId', Authenticate, bookSlot);
slotsRoutes.get("/getDoctorAvailableDays/:docId", getDoctorAvailableDays)
slotsRoutes.post('/updateSlotStatus/:slotId',updateSlotStatus )
slotsRoutes.get('/getDoctorSlots/:id', getDoctorSlots)
// slotsRoutes.get('/doctorUpdatedSlots/:docId', doctorUpdatedSlots)
// slotsRoutes.get("/getDoctorBookedSlots/:docId", getDoctorBookedSlots);
// slotsRoutes.get('/getBookedSlots/:docId', getBookedSlots);


export default slotsRoutes 
