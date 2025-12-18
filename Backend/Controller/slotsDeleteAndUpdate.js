import { AvailableSlots, Doctor } from "../models/user.js";

async function removeDuplicates() {
  console.log("removing Duplicates using aggregate")
  const duplicates = await AvailableSlots.aggregate([
    {
      $project: {
        doctorId: 1,
        slotTime: 1,
        startDate: "$slotDate.startDate",
        dayStr: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$slotDate.startDate",
            timezone: "Asia/Karachi"
          }
        }
      }
    },
    {
      $group: {
        _id: {
          doctorId: "$doctorId",
          day: "$dayStr",
          slotTime: "$slotTime"
        },
        ids: { $push: "$_id" },
        count: { $sum: 1 }
      }
    },
    { $match: { count: { $gt: 1 } } }
  ]);

  let delCount = 0;

  for (const dup of duplicates) {
    dup.ids.shift(); // keep one
    const res = await AvailableSlots.deleteMany({ _id: { $in: dup.ids } });
    delCount += res.deletedCount;
  }

  console.log(`duplication process finished by removing ${delCount} files`);
}

const updateDoctorSlots = async () => {

  const days = ["Mon", "Tue", "Wed", "Thu"];
  const newSlots = [
    '03:00-03:30 AM',
    '03:30-04:00 PM',
    '04:00-04:30 PM',
    '04:30-05:00 PM',
    '07:00-07:30 PM',
    '07:30-08:00 PM',
    '08:00-08:30 PM',
    '08:30-09:00 PM'
  ];

  const newAvailableDays = days.map((day) => ({
        day:day,
     slots:newSlots
    }
  ))

  console.log("New Slots; ", newAvailableDays);
  try {
    const updateSlots = await Doctor.updateMany(
      {
        
      },
      {
        $unset: {
          AvailableDays:""
        }
      }
    )
    console.log( "Successfully updated all doctors slots",updateSlots.modifiedCount, " match Count", updateSlots.matchedCount)
    // return res.status(200).json({
    //   success:true,
    //   message: "Successfully updated all doctors slots",
    //   updateSlots
    // })
  }
  catch (err) {
    console.log("error while updating slots ", err);
    // return res.status(500).json({
    //   success:false,
    //   message: "Error occurred while updating all doctors slots",
    //   err:err.message
    // })
  }
}

export default updateDoctorSlots
// export default removeDuplicates
