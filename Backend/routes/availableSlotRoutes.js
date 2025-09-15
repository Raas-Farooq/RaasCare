import express from 'express';
import { allDoctorsSlotsGenerator, bookSlot, getDoctorAvailableDays, getDoctorBookedSlots, updateSlotStatus } from '../Controller/slotsController.js';

const slotsRoutes = express.Router();

// o me, Safepay

// hey, your redirect url is missing attributes like environment, success and cancel url please see this document https://safepay-docs.netlify.app/
slotsRoutes.get('/generateDoctorsSlots', allDoctorsSlotsGenerator );
slotsRoutes.post('/bookSlot/:slotId', bookSlot);
// slotsRoutes.get('/getBookedSlots/:docId', getBookedSlots);
slotsRoutes.get("/getDoctorAvailableDays/:docId", getDoctorAvailableDays)
slotsRoutes.get("/getDoctorBookedSlots/:docId", getDoctorBookedSlots);
slotsRoutes.post('/updateSlotStatus/:slotId',updateSlotStatus )
// slotsRoutes.get('/doctorUpdatedSlots/:docId', doctorUpdatedSlots)


export default slotsRoutes 


// i could only provide the slotId but is it better to provide here doctorId as well?
// const updateResult = await AvailableSlots.findOneAndUpdate(
    //         { _id: slotId, doctorId:docId},
    //         {
    //             $set: {
    //                 updateOperation
    //             }
    //         },
    //         { new: true }
    //     );

    // 2nd:
    // try {
    
    //         const updateResult = await AvailableSlots.findOneAndUpdate(
    //             { _id: slotId, doctorId:docId},
    //             {
    //                 $set: {
    //                     updateOperation
    //                 }
    //             },
    //             { new: true }
    //         );
    
    //         if (!updateResult) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "Failed to Update the Slot status"
    //             })
    //         }
    
    //         return res.status(200).json({
    //             success: true,
    //             message: "Successfully updated the Slot status",
    //             result:updateResult
    //         })

    //         should we have this condtion of !updateResult before success message 