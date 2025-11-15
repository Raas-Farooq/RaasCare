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

    doctors.forEach(doctor => {
            const ops = createSlots(doctor);
            insertOps(ops);
        })
}
const insertOps = async(ops) => {
      if (ops.length > 0) {
            await AvailableSlots.deleteMany({"slotDate.endDate": {$lt: new Date()}});

            const bulkResult = await AvailableSlots.bulkWrite(ops, { ordered: false });
            if (bulkResult.mongoose && bulkResult.mongoose.validationErrors?.length) {
                console.error('got validationErrors during bulkWrite ', bulkResult.mongoose.validationErrors);
                throw new Error("Validation errors occurred while generating slots")        
            }
        }
}
function createSlots(doctor){
    const availableDays = doctor.availableDays;
    const forDays = 14;
    let ops = [];
    for (let dayObj of availableDays){
                const getDates = getNextAvailableDates(dayObj.day, forDays);
                for (let date of getDates) {
                    dayObj.slots.forEach((slotTime) => {
                        const dateSlots = makeSlotDate(date, slotTime);
                        const startAndEndDates = {
                            startDate: dateSlots.startDate,
                            endDate: dateSlots.endDate
                        }
                        ops.push({
                            updateOne: {
                                filter: { doctorId: doctor._id, "slotDate.startDate": startAndEndDates.startDate, slotTime },
                                update: {
                                    $setOnInsert: {
                                        doctorId: doctor._id,
                                        doctorName:doctor.username,
                                        doctorSpeciality:doctor.speciality,
                                        slotDate: {
                                            startDate: startAndEndDates.startDate,
                                            endDate: startAndEndDates.endDate
                                        },
                                        slotTime: slotTime,
                                        isBooked: false,
                                        isCancelled: false,
                                        sources: 'template'
                                    }
                                },
                                upsert: true
                            }
                        })

                    })
                }
            }
        return ops
}


async function generateNewDoctorSlots(req, res,next) {
            console.log("req.body ", req.body);
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
    console.log("slotId inside bookSlot ", slotId, "patientId ", patientId, "patineName ", patientName);
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
        console.log("slot: ", slot);

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
      console.log(" result  of aggregate: ", aggregateResult);
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
        await AvailableSlots.findOneAndUpdate(
            { _id: slotId, doctorId: docId },
            {
                $set: updateOperation

            },
            { new: true, lean: true }
        );

        const latestUpdatedSlots= {
            ...filterUpdatedSlots,
            "slotDate.startDate": {
                $gte:currentDate
            }
        }
        const latestSlots = (await AvailableSlots.find(latestUpdatedSlots)
        .lean()
        .limit(10)
        .sort({updatedAt:-1}))

        return res.status(200).json({
            success: true,
            message: "Successfully updated the Slot status",
            updatedSlots: latestSlots
        })

    } catch (err) {
         next(err)
    }
}


export {generateNewDoctorSlots, generateAllSlotsStartUp, getDoctorsAndAverageSalary, getPatientBookedSlots, updateSlotStatus, getDoctorBookedSlots, bookSlot, getDoctorAvailableDays, getDoctorSlots }

