import mongoose from "mongoose"

function ConnectingToDatabase(){

   mongoose.connect(process.env.MONGO_URI)
    .then(async() =>
        {
            console.log("MONGO DB Connected Successfully");
            // try{
            //     const collections = await mongoose.connection.db.listCollections().toArray();
            //     console.log("collections MONGo", collections);
            // } catch(err){
            //     console.log("got error while getting collections: ", err);
            // }
        })
    .catch(err => console.log("got error while connnecting to MongoDb: ", err))

    
    mongoose.connection.on("connected", () => {
        console.log("Connection is ON");
    })

}
export default ConnectingToDatabase;