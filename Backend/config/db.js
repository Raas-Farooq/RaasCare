import mongoose from "mongoose"
import updateDoctorSlots from "../Controller/slotsDeleteAndUpdate.js";


async function ConnectingToDatabase(){

   
  try{

    if(!process.env.MONGO_URI){
        throw new Error("mongo_uri is not defined ");
    }

    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS:30000
     })
    console.log("MongoDB connected successfully");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB runtime error:", err);
    });
  }
  catch(err){
    console.error("error while connecting to mongodb ", err);
    process.exit(1);
  }
}
export default ConnectingToDatabase;