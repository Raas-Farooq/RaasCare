import { Admin } from "../models/user";
import bcrypt from 'bcrypt';
import { config } from "dotenv";



config({path:path.resolve(process.cwd(), '../.env')});
config();

mongoose.connect(process.env.MONGO_URI).then(async() => {
    console.log("success Connection MongoDb");
}).catch(err => {
    console.log("Error while Mongoose connection ",err)
})

const superAdmin = async(req, res) => {
    const hashedPassword = await bcrypt.hash('raas$0022', 10);
    const userEmail = "raas@gmail.com"
    try{
        const creatingAdmin = await Admin.create({
        username:'Raas Ul Farooq',
        email:userEmail,
        password:hashedPassword,
        role:'admin',
        lastAccess:Date(),
        permissions:
            [
            'manage_patients', 
            "manage_doctors",
            "view_reports",
            "system_settings"
            ]
         })
        console.log("super Admin created successfully ", creatingAdmin);
        process.exit(0);
    }
    catch(err){
        console.log("error while creating super Admin ", err);
        process.exit(1);
 
    }
}

superAdmin()