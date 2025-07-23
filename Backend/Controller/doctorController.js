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

const DoctorAddPatient = async(req,res) => {


    const {patientName, age, gender, diagnosis}= req.body;


    try{
        const addPatient = new Patient({
            patientName,
            age,
            gender,
            diagnosis,
            medicalHistory:[{

            }]
        })

        const patientAdded = await addPatient.save();

        return res.status(201).json({
            success:false,
            message:"Patient has been added successfully",
            addedPatient:addPatient
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Server error while creating new Patient", err
        })
    }
}