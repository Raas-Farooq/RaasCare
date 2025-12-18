import { openSync } from "fs";
import { Appointments, AvailableSlots, Doctor } from "../models/user.js";
import mongoose from "mongoose";
import { use } from "react";
import { pipeline } from "stream";

const weekDays = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };


const getNextAvailableDates = (dayName, totalDays) => {

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = weekDays[dayName];
    if ((target === undefined)) {
        console.log("invalid dayName for generating nextAvailableDates");
        return []
    }
    let dates = [];
    for (let i = 0; i < totalDays; i++) {

        const slotDay = new Date(today);

        slotDay.setDate(today.getDate() + i);

        if (slotDay.getDay() === target) dates.push(new Date(slotDay))
    }

    return dates


}

const makeSlotDate = (onlyDate, timeString) => {
    const date = new Date(onlyDate);

    if (timeString.includes('-')) {
        // Example: "9:30-10:00 AM"
        let [range, period] = timeString.split(' '); // ["9:30-10:00", "AM"]
        let [startStr, endStr] = range.split('-');   // ["9:30", "10:00"]

        let [stHr, stM] = startStr.split(":").map(Number);
        let [endHr, endM] = endStr.split(":").map(Number);

        if (period === 'PM' && stHr < 12) stHr += 12;
        if (period === 'AM' && stHr === 12) stHr = 0;
        if (period === 'PM' && endHr < 12) endHr += 12;
        if (period === 'AM' && endHr === 12) endHr = 0;

        const startDate = new Date(onlyDate);
        const endDate = new Date(onlyDate);
        startDate.setHours(stHr, stM || 0, 0, 0);
        endDate.setHours(endHr, endM || 0, 0, 0);

        return { startDate, endDate };
    }

    // Single time like "04:00 PM"
    let [time, period] = timeString.split(' ');
    let [hr, m] = time.split(':').map(Number);

    if (period === 'PM' && hr < 12) hr += 12;
    if (period === 'AM' && hr === 12) hr = 0;

    date.setHours(hr, m || 0, 0, 0);

    return { startDate: date, endDate: null };
};

const generateAllSlotsStartUp= async(generateFor="all", doctorId="null") => {
    let doctors;
    // const docSlots = await AvailableSlots.find({doctorId:'693ce46789386e011f48a7db'});
    
    // const cleanedSlots = await AvailableSlots.deleteMany({
    //     "slotDate.endDate":{$lt:new Date()},
    // })
    // console.log(`Cleaned Up ${cleanedSlots.deletedCount} expired slots`)
    if(generateFor === 'all'){
        doctors = await Doctor.find({}).lean();
        if(!doctors.length){
            return res.status(404).json({
                message:"No doctor found for generating slots"
            })
        }
    }
    else if(generateFor === 'doctor'){
        if(!doctorId){
            console.error('doctorId is not received by the backend for generating slots')
            return res.status(400).json({
                success:false,
                message:"Id is not provided for generating new slots for a doctor"
            })
        }
        const doctor = await Doctor.findOne({_id:doctorId});
        doctors = [doctor]
    }
    else{
        return res.status(400).json({
            success:false,
            message:"Not mentioning single doctor or all doctors for generating slots"
        })
    }

    // doctors.forEach(doctor => {
    //         const ops = createSlots(doctor);
    //         insertOps(ops);
    //     })

    for (const doctor of doctors){
        await generateSlotsForDoctor(doctor);
    } 
}

// const insertOps = async(ops) => {
//       if (ops.length > 0) {
//             await AvailableSlots.deleteMany({"slotDate.endDate": {$lt: new Date()}});

//             const bulkResult = await AvailableSlots.bulkWrite(ops, { ordered: false });
//             if (bulkResult.mongoose && bulkResult.mongoose.validationErrors?.length) {
//                 console.error('got validationErrors during bulkWrite ', bulkResult.mongoose.validationErrors);
//                 throw new Error("Validation errors occurred while generating slots")        
//             }
//         }
// }

function exactDate(date){
   return date.toISOString().split('T')[0]
}
const generateSlotsForDoctor = async (doctor) => {
    const availableDays = doctor.availableDays;
    const forDays = 14; // Generate for next 14 days
    
    // Get existing future slots for this doctor to avoid duplicates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + forDays);
    const existingSlots = await AvailableSlots.find({
        doctorId: doctor._id,
        "slotDay":{
            $gte:exactDate(startDate),
            $lte:exactDate(endDate)
        }
    }).select('slotKey').lean();

    // Create lookup map for existing slots
 
    const existingKeys = new Set(existingSlots.map(slot => slot.slotKey))
    let newSlotsCount = 0;
    const bulkOps = [];

    for (let dayObj of availableDays) {
        const availableDates = getNextAvailableDates(dayObj.day, forDays);
        
        for (let date of availableDates) {
            const slotDay = exactDate(date);
            for (let slotTime of dayObj.slots) {
                const slotDates = makeSlotDate(date, slotTime);
                const slotKey =`${doctor._id}_${slotDay}_${slotTime}`
                // Check if slot already exists
                const existingSlot = existingKeys.has(slotKey);
                
                if (!existingSlot) {
                    console.log("not existing slot Time", slotTime)
                    // Slot doesn't exist - create new one
                    bulkOps.push({
                        insertOne: {
                            document: {
                                doctorId: doctor._id,
                                doctorName: doctor.username,
                                doctorSpeciality: doctor.speciality,
                                slotDate: {
                                    startDate: slotDates.startDate,
                                    endDate: slotDates.endDate
                                },
                                slotDay,
                                slotKey,
                                slotTime: slotTime,
                                status:"available",
                                isArchived:false,
                                patientId: null,
                                patientName: '',
                                source: 'template'
                            }
                        }
                    });
                    newSlotsCount++;
                }
            }
        }
    }

    // Insert only new slots
    if (bulkOps.length > 0) {
        console.log("one bulkOps ", bulkOps[0].insertOne.document)
        try {
            const result = await AvailableSlots.bulkWrite(bulkOps, { ordered: false });
            console.log("result: after creating slots", result)
        } catch (error) {
            if (error.code === 11000) {
                console.log(`Some duplicates detected for Dr. ${doctor.username}, continuing...`);
            } else {
                throw error;
            }
        }
    } else {
        console.log(`No new slots needed for Dr. ${doctor.username}`);
    }
}




async function generateNewDoctorSlots(req, res,next) {
          
            const {generateFor, doctorId} = req.body;
            
            try{
                if(generateFor !== "doctor"){
                    return res.status(400).send("GenerateFor ('one doctor or all Doctors') is not defined");
                }
                if(!doctorId){
                    console.error('doctorId is not received by the backend for generating slots')
                    return res.status(400).json({
                        success:false,
                        message:"Id is not provided for generating new slots for a doctor"
                    })
                }
                 await generateAllSlotsStartUp(generateFor, doctorId);
            
                 return res.status(200).json({
                    success: true,
                    message: "Available Slots generated sucessfully",

                 })
            }
      
    catch (err) {
       next(err)
    }

}

// booking a slot and also add it to appointments
// future use sessions to work with both methods adding slot and Appointment
const bookSlot = async (req, res, next) => {
    const { slotId } = req.params;
    const { patientName, docId, patientId } = req.body;
        try {
        const slot = await AvailableSlots.findOneAndUpdate(
            { _id: slotId, status: "available" },
            {
                $set: {
                    status: 'booked',
                    patientName,
                    patientId,
                }
            },
            {
                new: true
            }
        )

        if (!slot) return res.status(400).json("Slot is Not Available")


        const addAppointment = new Appointments({
            doctorId: slot.doctorId,
            patientId,
            date: {
                startDate: slot.slotDate.startDate,
                endDate: slot.slotDate.endDate || null,
            },

            time: slot.slotTime,
            status: 'booked',

        })
        await addAppointment.save();
        return res.status(200).json({
            success: true,
            message: "slot booked successfully",
            slot
        })
    }
    catch (err) {

        next(err)
    }
}



const ObjectId = mongoose.Types.ObjectId;


const getDoctorAvailableDays = async (req, res, next) => {

    const { docId } = req.params;
    const doctorSlots = await AvailableSlots.find({doctorId:docId});
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    try {

        const pipeline = [
            { $match: { doctorId: new ObjectId(docId), "slotDate.startDate": { $gte: startDate }, status:{$in:['available', 'cancelled', 'booked', 'completed']}} },
            {
                $project: {
                    slotDate: 1,
                    slotTime: 1,
                    status:1,
                    isArchived:1,
                    dayStr: { $dateToString: { format: "%Y-%m-%d", date: '$slotDate.startDate', timezone: "Asia/Karachi" } }
                },
            },
            {
                $group: {
                    _id: "$dayStr",
                    date: { $first: "$slotDate.startDate" },
                    slots:{$addToSet:{slotId: "$_id", slotTime:"$slotTime", status:"$status", isArchived:"$isArchived"}}
                }
            },
            { $sort: { date: 1 } }
        ];    
        const remainingSlots = await AvailableSlots.aggregate(pipeline);

        res.status(200).json({ success: true, remainingSlots })
    }
    catch (err) {
        next(err)
    }
}



const getDoctorsAndAverageSalary = async(req,res) => {
   try{
     const pipeline = [
       {
         $match:{ role:'doctor', available:true}
       },
       {
        $project:{
            _id:0,
            education:1,
            experience:1,
            address:1
            }
       },
       {
        $sort:{
        experience:-1
       }
       }
    ]

    const aggregateResult = await Doctor.aggregate(pipeline);
        return res.status(200).json({result: aggregateResult});
  
   }
   catch(err){
    console.error("err while working with aggregate: ", err);
    return res.status(500).json({err: err.message})
   }
}
const getDoctorSlots = async (req, res, next) => {

    const { id } = req.params;
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const today = new Date().toISOString().split('T')[0];
    try {
        const updatedSlots = await AvailableSlots.find().lean();
        res.status(200).json({ success: true, updatedSlots })
    }
    catch (err) {
        next(err)
    }
}

const getPatientBookedSlots = async (req, res, next) => {
    const { patientId } = req.params;
    try {
        const bookedSlots = await AvailableSlots.find({ patientId, 
                 status:{$in:["booked","cancelled","completed"]}
        });

        if (!bookedSlots.length) {
            return res.status(404).json({
                success: false,
                message: "You haven't booked slot yet"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Successfully got your booked Slots",
            bookedSlots
        })
    } catch (err) {
         next(err)
    }
}


const updateSlotStatus = async (req, res, next) => {

    const { slotId } = req.params;
    const { action, docId, role } = req.body;
    const today = new Date();
    today.setHours(0,0,0,0);
    let filterUpdatedSlots;
    if(role === 'admin'){
        
           filterUpdatedSlots = {
                
                "slotDate.startDate":{$gte: today}
                ,
                status:{$in:["booked","cancelled","completed"]}
            }
        
    }
    else{
        filterUpdatedSlots = {
            doctorId:docId,
            "slotDate.startDate":{$gte:today},
            status:{$in:["booked","cancelled","completed"]}
        }
    }
    let updateOperation;
    switch (action) {
        case 'remove': {
            updateOperation = {
                status:"completed",
                isArchived:true,
            }
            break;
        }
        case 'cancel': {
            updateOperation = {
                status:"cancelled",
            }
            break;
        }
        case 'complete': {
            updateOperation = {
                 status:"completed",
            }
            break;
        }
    }

    if (!updateOperation) {
        return res.status(400).json({ success: false, message: "invalid action" })
    }
    try {
    await AvailableSlots.findOneAndUpdate(
            { _id: slotId, doctorId: docId },
            {
                $set: updateOperation

            },
            { new: true, lean: true, sort:{updatedAt:-1}}
        );
        const latestUpdatedSlots= {
            ...filterUpdatedSlots,
        }
        let latestRemainingSlots;
        if(role === 'doctor'){
             latestRemainingSlots = (await AvailableSlots.find(latestUpdatedSlots)
            .lean()
            .sort({updatedAt:-1}))
        }
       else{
         latestRemainingSlots = (await AvailableSlots.find( latestUpdatedSlots)
            .lean()
            .limit(10)
            .sort({updatedAt:-1}))
       }
        return res.status(200).json({
            success: true,
            message: "Successfully updated the Slot status",
            updatedSlots: latestRemainingSlots
        })

    } catch (err) {
         next(err)
    }
}

// Safe version for production - runs daily maintenance
const runDailySlotMaintenance = async () => {
    try {
        console.log('Running daily slot maintenance...');
        // 1. Mark past booked slots as completed
        const completedResult = await AvailableSlots.updateMany(
            {
                "slotDate.endDate": { $lt: new Date() },
            },
            {
                $set: { 
                    status:"completed",
                     isArchived: true
                     }
            }
        );
        console.log(`Marked ${completedResult.modifiedCount} past appointments as completed`);

        // 2. Clean up expired available slots (not booked)
        // const cleanupResult = await AvailableSlots.deleteMany({
        //     "slotDate.startDate": { $lt: new Date() },
        //     status: "completed",
        //     isArchived:true
        // });
        // console.log(`Cleaned up ${cleanupResult.deletedCount} expired available slots`);

        // 3. Generate new slots for next 14 days
        await generateAllSlotsStartUp('all');
        
        console.log('✅ Daily slot maintenance completed');
        
    } catch (error) {
        console.error('❌ Daily slot maintenance failed:', error);
        // Don't throw - this is a maintenance function
    }
};



export { runDailySlotMaintenance, generateNewDoctorSlots, generateAllSlotsStartUp, getDoctorsAndAverageSalary, updateSlotStatus, bookSlot, getDoctorAvailableDays, getDoctorSlots }

// 2️⃣ The REAL problem: your unique index
// Your index:
// availableSlotsSchema.index(
//   { doctorId: 1, slotDate: 1, patientId: 1 },
//   { unique: true }
// );

// Why this is dangerous ❌

// patientId is null for all unbooked slots

// MongoDB allows only ONE document with:

// doctorId = X
// slotDate = Y
// patientId = null


// That means:

// 👉 If you try to insert two unbooked slots for the same doctor + same slotDate, MongoDB treats them as duplicates even if slotTime is different.

// Example:
// 9:00–9:30  (patientId: null)
// 9:30–10:00 (patientId: null)


// Both share:

// doctorId: X
// slotDate.startDate: same day
// patientId: null

// you know what i didn't get this concept fully of how unique index is preventing data to be added inside mongodb? can you explain it with any other easy examples as well