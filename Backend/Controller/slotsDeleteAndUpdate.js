import { AvailableSlots } from "../models/user.js";

async function removeDuplicates(){
    console.log("removing Duplicates using aggregate")
    const duplicates = await AvailableSlots.aggregate([
  { $project: {
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
 delCount+= res.deletedCount;
}

    console.log(`duplication process finished by removing ${delCount} files`);
}

export default removeDuplicates
