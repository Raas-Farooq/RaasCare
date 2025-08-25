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

const bookAppointment = async (req, res) => {

    const { id } = req.params;
    console.log("make Appointment Runs")
    const { docId, selectedDay, selectedTime, patientName} = req.body;

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
        res.status(500).json({
            success: false,
            message: "Server error while booking an Appointment", err
        })
    }
}

const cancelAppointment = async (req, res) => {

    const { id } = req.params;
    console.log("cancel Appointment Runs ",id)
    const { patientId, slotDay, slotTime } = req.body;
    console.log("patientId: ", patientId, 'slotDay ', slotDay , " slotTime ", slotTime);
    try{
        const doctor = await Doctor.findOne({_id: id});
        if(!doctor){
            return res.status(404).json({
                success: false,
                message: "Doctor Not found"
            })
        }
        const action = 'cancel'; 
        const cancelResult = await Doctor.findOneAndUpdate(
            {_id: id},
            {
         
                $set:{
                    "availableDays.$[dayIdentifier].slots.$[slotIdentifier].isCancelled":true,
                    "availableDays.$[dayIdentifier].slots.$[slotIdentifier].isBooked":false,
                    "availableDays.$[dayIdentifier].slots.$[slotIdentifier].isCompleted":false,
                }                
            },
            {
                arrayFilters:[
                    {"dayIdentifier.day": slotDay},
                    {"slotIdentifier.slotTime": slotTime},
                ],
                new:true
            }
        )
        console.log("cancelRequest result ", cancelResult);
        if(!cancelResult){
            return res.status(400).json({
                success: false,
                message: "Slot not found or already booked"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Appointment cancelled Successfully",
            updatedProfile: cancelResult
        })
        
    }
     catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error while cancelling an Appointment", err
        })
    }
}

const completeAppointment = async (req, res) => {

    const { id } = req.params;
    console.log("complete Appointment Runs ",id)
    const { patientId, slotDay, slotTime } = req.body;
    console.log("patientId: ", patientId, 'slotDay ', slotDay , " slotTime ", slotTime);
    try{
        const doctor = await Doctor.findOne({_id: id});
        // doctor.availableDays.forEach((slot)=> {
        //     console.log("slt is here ", slot); 
        // });
        if(!doctor){
            return res.status(404).json({
                success: false,
                message: "Doctor Not found"
            })
        }
        const completedResult = await Doctor.findOneAndUpdate(
            {_id: id},
            {
                $set:{
                    "availableDays.$[dayIdentifier].slots.$[slotIdentifier].isCancelled":false,
                    "availableDays.$[dayIdentifier].slots.$[slotIdentifier].isBooked":false,
                    "availableDays.$[dayIdentifier].slots.$[slotIdentifier].isCompleted":true,
                }
            },
            {
                arrayFilters:[
                    {"dayIdentifier.day": slotDay},
                    {"slotIdentifier.slotTime": slotTime},
                ],
                new:true
            }
        )
        console.log("completedResult Request result ", completedResult);
        if(!completedResult){
            return res.status(400).json({
                success: false,
                message: "Slot not found or already booked"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Appointment completed Successfully",
            updatedProfile: completedResult
        })
        
    }
     catch (err) {
        console.error("Completion error:", err);
        res.status(500).json({
            success: false,
            message: "Server error while completing an Appointment",
            err:err.message
        })
    }
}

export { fetchAllDoctors, fetchDoctorProfile, bookAppointment, cancelAppointment, completeAppointment };