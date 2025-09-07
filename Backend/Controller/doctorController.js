// Doctor submits minimal info
// await Doctor.findByIdAndUpdate(doctorId, {
//   $push: {
//     createdPatients: {
//       fullName: 'John Doe',
//       age: 35,
//       diagnosis: 'Hypertension'
//     }
//   }
// });
// For Registered Patients:

import { Doctor } from "../models/user.js";

// javascript
// // Doctor links to existing user
// await User.findByIdAndUpdate(patientId, {
//   $push: {
//     'patientProfile.medicalHistory': {
//       diagnosis: 'Hypertension',
//       createdBy: doctorId
//     }
//   }
// });



// When Unregistered Patients Later Register
// javascript
// // During registration
// app.post('/register', async (req, res) => {
//   // Check if doctor-created profile exists
//   const doctorCreatedProfile = await Doctor.findOne({
//     'createdPatients.email': req.body.email
//   });

//   if (doctorCreatedProfile) {
//     // Migrate the data
//     await User.create({
//       ...req.body,
//       patientProfile: doctorCreatedProfile.createdPatients.find(p => p.email === req.body.email)
//     });

//     // Remove from doctor's list
//     await Doctor.updateOne(
//       { _id: doctorCreatedProfile._id },
//       { $pull: { createdPatients: { email: req.body.email } } }
//     );
//   }
// });

const DoctorAddPatient = async (req, res) => {


    const { patientName, age, gender, diagnosis } = req.body;


    try {
        const addPatient = new Patient({
            patientName,
            age,
            gender,
            diagnosis,
            medicalHistory: [{

            }]
        })

        const patientAdded = await addPatient.save();

        return res.status(201).json({
            success: false,
            message: "Patient has been added successfully",
            addedPatient: addPatient
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error while creating new Patient", err
        })
    }
}

const fetchAllDoctors = async (req, res) => {


    try {
        const doctorsList = await Doctor.find({});
        console.log("doctor list; ", doctorsList);
        if (doctorsList.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Doctor found"
            })
        }

        return res.status(201).json({
            success: true,
            message: "doctors list fetched successfully",
            doctorsList
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error while getting Doctors list", err
        })
    }
}
const fetchDoctorProfile = async (req, res) => {

    const { id } = req.params;
    try {
        const doctor = await Doctor.findOne({ _id: id });
        // const allDoctors = await
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor Not found"
            })
        }

        return res.status(201).json({
            success: true,
            message: "doctor Profile fetched successfully",
            doctorProfile: doctor
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error while getting Doctor Profile", err
        })
    }
}

const getNextAppointmentDay = (userDay) => {
    const daysOfWeek={ Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 };
    const todayDate= new Date();
    const todayIndex = todayDate.getDay();
    const userSelectedDay = daysOfWeek[userDay];

    let diff = userSelectedDay - todayIndex;
    if(diff <0 ) diff+= 7;

    const targetDate = new Date();

    targetDate.setDate(todayDate.getDate() + diff);
    targetDate.setHours(0,0,0,0);

    return targetDate;
}

const modernBookAppointment = async(req,res) => {
    const { docId } = req.params;
    console.log("make Appointment Runs")
    const { patientId, selectedDay, selectedTime } = req.body;

    try {
        const doctor = await Doctor.findOne({ _id: docId });
        console.log("docId ", docId, " selectedDay ", selectedDay, " selectedTime ", selectedTime, "patientId ", id)
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor Not found"
            })
        }

        const getNextAppointmentDate = getNextAppointmentDay(selectedDay);

        const isAlreadyBooked = await Appointment.findOne({
            doctorId:docId,
            patientId,
            time:selectedTime,
            date:getNextAppointmentDate,
            status:'booked'
        })

        if(isAlreadyBooked){
            return res.status(400).json("Appointment Already Booked. Please Select another One");
        }

        const addingAppointment = new Appointment ({
            doctorId:docId,
            patientId,
            time:selectedTime,
            date:getNextAppointmentDate,
            status:'booked'
        })

        await addingAppointment.save();

        return res.status(200).json({
            success:true,
            message:"Appointment Added Successfully",
            newAppointment:added 
        })
    }
    catch(err){

    }

}

const doctorAvailablity = async(req, res) => {

    const id= req.params.id;
    const doctor = await Doctor.findOne({_id:id});

    if(!doctor){
        return res.status(404).json("Doctor not Found");
    }

    const availableSlots = doctor.availableDays;
    let upcomingDays = [];
    let slots = [];
    for(let dailyTiming of availableSlots){
        const apptDate = getNextAppointmentDay(dailyTiming.day);
        
        for (let slot of dailyTiming.slots){
            const appt = await Appointment.findOne({
            doctorId:id,
            time:slot,
            date:apptDate,
            status:'booked'
        })

        slots.push({
            time:slot,
            isBooked:!!appt
        })
        }
        
        upcomingDays.push({day:dailyTiming.day, slots})

        res.json(upcomingDays);

    }

}   

const bookAppointment = async (req, res) => {

    const { id } = req.params;
    console.log("make Appointment Runs")
    const { docId, selectedDay, selectedTime, patientName } = req.body;

    try {
        const doctor = await Doctor.findOne({ _id: docId });
        console.log("docId ", docId, " selectedDay ", selectedDay, " selectedTime ", selectedTime, "patientId ", id)
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor Not found"
            })
        }

        const result = await Doctor.updateOne(
            { _id: docId },
            {
                $set: {
                    "availableDays.$[dayIdentifier].slots.$[slotIdentifier].isBooked": true,
                    'availableDays.$[dayIdentifier].slots.$[slotIdentifier].patientId': id,
                    'availableDays.$[dayIdentifier].slots.$[slotIdentifier].patientName': patientName
                }
            },
            {
                arrayFilters: [
                    { "dayIdentifier.day": selectedDay },
                    { "slotIdentifier.slotTime": selectedTime }
                ]

            }
        )
        console.log("result: ", result);
        if (result.modifiedCount === 0) {
            return res.status(400).json({
                success: false,
                message: "Slot not found or already booked"
            });
        }
        return res.status(201).json({
            success: true,
            message: "Your Appointment Added Successfully",
        })
    }
    catch (err) {
        console.error(`error while adding appointment`, err);
        res.status(500).json({
            success: false,
            message: `Server error while adding an Appointment`,
            err: err.message
        })
    }
}

const handleAppointmentAction = async (req, res) => {

    const { id } = req.params;
    console.log("cancel Appointment Runs ", id)
    const { action, patientId, slotDay, slotTime } = req.body;
    console.log("action:", action, "patientId: ", patientId, 'slotDay ', slotDay, " slotTime ", slotTime);
    try {
        const doctor = await Doctor.findOne({ _id: id });
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor Not found"
            })
        }
        let updateFields;

        switch (action) {
            case 'remove':
                updateFields = {
                    "availableDays.$[dayIdentifier].slots.$[slotIdentifier].isBooked": false,
                    "availableDays.$[dayIdentifier].slots.$[slotIdentifier].isCompleted": false,
                    "availableDays.$[dayIdentifier].slots.$[slotIdentifier].isCancelled": false,
                    "availableDays.$[dayIdentifier].slots.$[slotIdentifier].patientName": '',
                    "availableDays.$[dayIdentifier].slots.$[slotIdentifier].patientId": null // Also remove patientId
                };
                break;

            case 'cancel':
                updateFields = {
                    "availableDays.$[dayIdentifier].slots.$[slotIdentifier].isBooked": false,
                    "availableDays.$[dayIdentifier].slots.$[slotIdentifier].isCompleted": false,
                    "availableDays.$[dayIdentifier].slots.$[slotIdentifier].isCancelled": true
                };
                break;

            case 'complete':
                updateFields = {
                    "availableDays.$[dayIdentifier].slots.$[slotIdentifier].isBooked": false,
                    "availableDays.$[dayIdentifier].slots.$[slotIdentifier].isCompleted": true,
                    "availableDays.$[dayIdentifier].slots.$[slotIdentifier].isCancelled": false
                };
                break;

            default:
                return res.status(400).json({ success: false, message: "Invalid action" });
        }

        let properArrayFilters =
            action === 'remove' ?
                [
                    { "dayIdentifier.day": slotDay },
                    { "slotIdentifier.slotTime": slotTime, "slotIdentifier.patientId": patientId}
                ]
                :
                [
                    {
                        "dayIdentifier.day": slotDay,
                    },
                    { "slotIdentifier.slotTime": slotTime}
                ]

        const updateResult = await Doctor.findOneAndUpdate(
            { _id: id },
            {
                $set: updateFields
            },
            {
                arrayFilters: properArrayFilters,
                new: true
            }
        )
        console.log("updateResult  ", updateResult);
        if (!updateResult) {
            return res.status(400).json({
                success: false,
                message: "Slot not found or already booked"
            });
        }
        return res.status(200).json({
            success: true,
            message: `Appointment ${action}ed Successfully`,
            updatedProfile: updateResult
        })

    }
    catch (err) {
        console.error(`error while ${action}ing appointment`, err);
        res.status(500).json({
            success: false,
            message: `Server error while ${action}ing an Appointment`,
            err: err.message
        })
    }
}


export { handleAppointmentAction, fetchAllDoctors, fetchDoctorProfile, bookAppointment };