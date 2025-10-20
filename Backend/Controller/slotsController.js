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

async function allDoctorsSlotsGenerator(req, res) {
    const forDays = 14;
    const doctors = await Doctor.find({}).lean();
    try {
        let ops = [];
        doctors.forEach(doctor => {
            const availableDays = doctor.availableDays;
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
        })
        if (ops.length > 0) {
            const bulkResult = await AvailableSlots.bulkWrite(ops, { ordered: false });
            if (bulkResult.mongoose && bulkResult.mongoose.validationErrors?.length) {
                console.error('got validationErrors during bulkWrite ', bulkResult.mongoose.validationErrors);
                return res.status(400).json(
                    {
                        success: false,
                        message: "Validation errors occurred while generating slots",
                        errors: bulkResult.mongoose.validationErrors.map(e => e.message)
                    }
                )
            }

            return res.status(200).json({
                success: true,
                message: "Available Slots generated sucessfully",

            })
        }
        else {
            return res.status(400).json(
                {
                    success: false,
                    message: "not able to generate slots",
                }
            )
        }
    }
    catch (err) {
        console.error("error while getting the 2 week schedule of doctor", err);

        return res.status(500).json({
            success: false,
            message: "Got server error while getting the 2 week schedule of doctor",
            err: err.message
        })
    }

}

// booking a slot and also add it to appointments
// future use sessions to work with both methods adding slot and Appointment
const bookSlot = async (req, res) => {
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
        console.error("server error while booking slot", err);

        return res.status(500).json({
            success: false,
            message: "server error while booking slot",
            err: err.message
        })
    }
}
const ObjectId = mongoose.Types.ObjectId;


const getDoctorAvailableDays = async (req, res) => {

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
        console.error("got error while aggregating the Doctor Available days");
        return res.status(500).json({
            success: false,
            message: "internal server error while getting the Doctor Available days",
            err: err.message
        })
    }
}



const getDoctorsAndAverageSalary = async(req,res) => {
    console.log("AVage sla baceknd runsss")
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
const getDoctorSlots = async (req, res) => {

    const { docId } = req.params;
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    try {
        const updatedSlots = await AvailableSlots.find({ doctorId: docId });


        res.status(200).json({ success: true, updatedSlots })
    }
    catch (err) {
        console.error("got error while getting Doctor updated Slots");
        return res.status(500).json({
            success: false,
            message: "internal server error while getting the Doctor updated Slots",
            err: err.message
        })
    }
}

const getDoctorBookedSlots = async (req, res) => {
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
        console.error("got error while getting booked Slots");
        return res.status(500).json({
            success: false,
            message: "internal server error while getting booked Slots",
            err: err.message

        })
    }
}

const getPatientBookedSlots = async (req, res) => {
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
        console.error("got error while getting booked Slots");
        return res.status(500).json({
            success: false,
            message: "internal server error while getting booked Slots",
            err: err.message

        })
    }
}


const updateSlotStatus = async (req, res) => {

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

    console.log("role; ",role, "action ", action, "slotId ", slotId, "docId; ", docId);
    if (!updateOperation) {
        return res.status(400).json({ success: false, message: "invalid action" })
    }
    try {

        await AvailableSlots.findOneAndUpdate(
            { _id: slotId, doctorId: docId },
            {
                $set: updateOperation

            },
            { new: true, lean: true }
        );

        const latestSlots = await AvailableSlots.find(filterUpdatedSlots).lean().limit(10);
        console.log("latest Slots: ", latestSlots)
        return res.status(200).json({
            success: true,
            message: "Successfully updated the Slot status",
            updatedSlots: latestSlots
        })

    } catch (err) {
        console.error("got error while Updating the Slot status");
        return res.status(500).json({
            success: false,
            message: "internal server error while Updating the Slot status",
            err: err.message

        })
    }
}


export { getDoctorsAndAverageSalary, getPatientBookedSlots, updateSlotStatus, allDoctorsSlotsGenerator, getDoctorBookedSlots, bookSlot, getDoctorAvailableDays, getDoctorSlots }

