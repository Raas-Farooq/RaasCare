import mongoose from "mongoose"
import updateDoctorSlots from "../Controller/slotsDeleteAndUpdate.js";


async function ConnectingToDatabase(){

  try{
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS:3000
     })
    .then(async() =>
        {
            console.log("MONGO DB Connected Successfully");
            // updateDoctorSlots();
        })
    .catch(err => console.log("got error while connnecting to MongoDb: ", err))

    
    mongoose.connection.on("connected", () => {
        console.log("Connection is ON");
    })
  }
  catch(err){
    console.error("error while connecting to mongodb ", err);
    process.exit(1);
  }
}
export default ConnectingToDatabase;