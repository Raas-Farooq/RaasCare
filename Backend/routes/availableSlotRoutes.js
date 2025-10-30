import express from 'express';
import { bookSlot, generateNewDoctorSlots, getDoctorAvailableDays, getDoctorBookedSlots, updateSlotStatus } from '../Controller/slotsController.js';

const slotsRoutes = express.Router();

// o me, Safepay

// hey, your redirect url is missing attributes like environment, success and cancel url please see this document https://safepay-docs.netlify.app/
slotsRoutes.post('/generateNewDoctorSlots', generateNewDoctorSlots);
slotsRoutes.post('/bookSlot/:slotId', bookSlot);
// slotsRoutes.get('/getBookedSlots/:docId', getBookedSlots);
slotsRoutes.get("/getDoctorAvailableDays/:docId", getDoctorAvailableDays)
slotsRoutes.get("/getDoctorBookedSlots/:docId", getDoctorBookedSlots);
slotsRoutes.post('/updateSlotStatus/:slotId',updateSlotStatus )
// slotsRoutes.get('/doctorUpdatedSlots/:docId', doctorUpdatedSlots)


export default slotsRoutes 
