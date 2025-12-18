import mongoose from "mongoose"
import updateDoctorSlots from "../Controller/slotsDeleteAndUpdate.js";


function ConnectingToDatabase(){

   mongoose.connect(process.env.MONGO_URI)
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
export default ConnectingToDatabase;