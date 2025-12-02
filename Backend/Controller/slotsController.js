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

    const cleanedSlots = await AvailableSlots.deleteMany({
        "slotDate.endDate":{$lt:new Date()},
        "isBooked":false,
        "isCancelled":false
    })
    console.log(`Cleaned Up ${cleanedSlots.deletedCount} expired slots`)
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
const generateSlotsForDoctor = async (doctor) => {
    const availableDays = doctor.availableDays;
    const forDays = 14; // Generate for next 14 days
    
    // Get existing future slots for this doctor to avoid duplicates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + forDays);
    
    const existingSlots = await AvailableSlots.find({
        doctorId: doctor._id,
        "slotDate.startDate": { 
            $gte: startDate,
            $lte: endDate 
        }
    }).select('slotDate.startDate slotTime isBooked').lean();

    // Create lookup map for existing slots
    const existingSlotsMap = new Map();
    existingSlots.forEach(slot => {
    
        const key = `${slot.slotDate.startDate.getTime()}-${slot.slotTime}`;
        existingSlotsMap.set(key, slot);
    });
    let newSlotsCount = 0;
    const bulkOps = [];

    for (let dayObj of availableDays) {
        const availableDates = getNextAvailableDates(dayObj.day, forDays);
        
        for (let date of availableDates) {
            for (let slotTime of dayObj.slots) {
                const slotDates = makeSlotDate(date, slotTime);
                const slotKey = `${slotDates.startDate.getTime()}-${slotTime}`;
                
                // Check if slot already exists
                const existingSlot = existingSlotsMap.get(slotKey);
                
                if (!existingSlot) {
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
                                slotTime: slotTime,
                                isBooked: false,
                                isCancelled: false,
                                isCompleted: false,
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
        try {
            const result = await AvailableSlots.bulkWrite(bulkOps, { ordered: false });
            console.log(`Created ${newSlotsCount} new slots for Dr. ${doctor.username}`);
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

// function createSlots(doctor){
//     const availableDays = doctor.availableDays;
//     const forDays = 14;
//     let ops = [];
//     for (let dayObj of availableDays){
//                 const getDates = getNextAvailableDates(dayObj.day, forDays);
//                 for (let date of getDates) {
//                     dayObj.slots.forEach((slotTime) => {
//                         const dateSlots = makeSlotDate(date, slotTime);
//                         const startAndEndDates = {
//                             startDate: dateSlots.startDate,
//                             endDate: dateSlots.endDate
//                         }
//                         ops.push({
//                             updateOne: {
//                                 filter: { doctorId: doctor._id, "slotDate.startDate": startAndEndDates.startDate, slotTime },
//                                 update: {
//                                     $setOnInsert: {
//                                         doctorId: doctor._id,
//                                         doctorName:doctor.username,
//                                         doctorSpeciality:doctor.speciality,
//                                         slotDate: {
//                                             startDate: startAndEndDates.startDate,
//                                             endDate: startAndEndDates.endDate
//                                         },
//                                         slotTime: slotTime,
//                                         isBooked: false,
//                                         isCancelled: false,
//                                         sources: 'template'
//                                     }
//                                 },
//                                 upsert: true
//                             }
//                         })

//                     })
//                 }
//             }
//         return ops
// }


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
            { _id: slotId, isBooked: false, isCancelled: false },
            {
                $set: {
                    isBooked: true,
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
    const doctorSlots = await AvailableSlots.findOne({doctorId:docId});

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    try {

        const pipeline = [
            { $match: { doctorId: new ObjectId(docId), "slotDate.startDate": { $gte: startDate }, isBooked: false, isCompleted: false } },
            {
                $project: {
                    slotDate: 1,
                    slotTime: 1,
                    isBooked:1,
                    dayStr: { $dateToString: { format: "%Y-%m-%d", date: '$slotDate.startDate', timezone: "Asia/Karachi" } }
                },
            },
            {
                $group: {
                    _id: "$dayStr",
                    date: { $first: "$slotDate.startDate" },
                    slots: { $push: { slotId: "$_id", slotTime: "$slotTime", isBooked:"$isBooked" } }
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

    const { docId } = req.params;
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    try {
        const updatedSlots = await AvailableSlots.find({ doctorId: docId });


        res.status(200).json({ success: true, updatedSlots })
    }
    catch (err) {
        next(err)
    }
}

const getDoctorBookedSlots = async (req, res,next) => {
    const { docId } = req.params;
    try {
        const bookedSlots = await AvailableSlots.find({ doctorId: docId,
                $or:[
                    {isBooked: true}, 
                    {isCancelled:true}, 
                    {isCompleted:true}
                ]
        });

        if (!bookedSlots.length) {
            return res.status(404).json({
                success: false,
                message: "No Booked Slots found for you yet "
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

const getPatientBookedSlots = async (req, res, next) => {
    const { patientId } = req.params;
    try {
        const bookedSlots = await AvailableSlots.find({ patientId, 
                $or:[
                    {isBooked: true}, 
                    {isCancelled:true}, 
                    {isCompleted:true}
                ]
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
 
    let filterUpdatedSlots;
    if(role === 'admin'){
        
           filterUpdatedSlots = {
                
                "slotDate.startDate":{$gte: new Date()}
                ,
                $or:[
                    {isBooked:true},
                    {isCancelled:true},
                    {isCompleted:true}
                ]
            }
        
    }
    else{
        filterUpdatedSlots = {
            doctorId:docId,
            "slotDate.startDate":{$gte:new Date()},
                $or:[
                    {isBooked:true},
                    {isCancelled:true},
                    {isCompleted:true}
                ]
        }
    }
    let updateOperation;
    switch (action) {
        case 'remove': {
            updateOperation = {
                isBooked: false,
                isCancelled: false,
                isCompleted: false,
                patientName: '',
                patientId: null
            }
            break;
        }
        case 'cancel': {
            updateOperation = {
                isBooked: false,
                isCancelled: true,
                isCompleted: false,
                // patientName: '',
                // patientId: null
            }
            break;
        }
        case 'complete': {
            updateOperation = {
                isBooked: false,
                isCancelled: false,
                isCompleted: true,
            }
            break;
        }
    }

    if (!updateOperation) {
        return res.status(400).json({ success: false, message: "invalid action" })
    }
    try {

        const currentDate = new Date();
        console.log("current Date: ", currentDate);
        const resultOfUpdateOperation = await AvailableSlots.findOneAndUpdate(
            { _id: slotId, doctorId: docId },
            {
                $set: updateOperation

            },
            { new: true, lean: true, sort:{updatedAt:-1}}
        );
 console.log(" result of UpdateOperation : ", resultOfUpdateOperation)
        const latestUpdatedSlots= {
            ...filterUpdatedSlots,
            // "slotDate.startDate": {
            //     $gte:currentDate
            // }
        }
        let latestRemainingSlots;
        if(role === 'doctor'){
            console.log("latest filtered slots logic ", latestUpdatedSlots, " filter logic ", filterUpdatedSlots);
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

        console.log("latestSlots: remain", latestRemainingSlots)
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
                "isBooked": true,
                "isCompleted": false
            },
            {
                $set: { isBooked:false,
                     isCompleted: true }
            }
        );
        console.log(`Marked ${completedResult.modifiedCount} past appointments as completed`);

        // 2. Clean up expired available slots (not booked)
        const cleanupResult = await AvailableSlots.deleteMany({
            "slotDate.endDate": { $lt: new Date() },
            "isBooked": false
        });
        console.log(`Cleaned up ${cleanupResult.deletedCount} expired available slots`);

        // 3. Generate new slots for next 14 days
        await generateAllSlotsStartUp('all');
        
        console.log('✅ Daily slot maintenance completed');
        
    } catch (error) {
        console.error('❌ Daily slot maintenance failed:', error);
        // Don't throw - this is a maintenance function
    }
};



export {runDailySlotMaintenance, generateNewDoctorSlots, generateAllSlotsStartUp, getDoctorsAndAverageSalary, getPatientBookedSlots, updateSlotStatus, getDoctorBookedSlots, bookSlot, getDoctorAvailableDays, getDoctorSlots }

