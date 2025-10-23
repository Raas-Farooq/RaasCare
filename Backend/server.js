import { config } from 'dotenv';
import express from 'express';
import ConnectingToDatabase from './config/db.js';
import patientRoutes from './routes/patientRoutes.js';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import cookieParser from 'cookie-parser';
import Patient from './models/patient.js';
import fileUpload from 'express-fileupload';
import doctorRoutes from './routes/doctorRoutes.js';
import slotsRoutes from './routes/availableSlotRoutes.js';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { schedule } from 'node-cron';
import { allDoctorsSlotsGenerator, generateAllSlotsStartUp } from './Controller/slotsController.js';


config()

const app = express();
const Port = 2500;
ConnectingToDatabase();


app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
const limiter = rateLimit({
    windowMs:15 * 60 * 1000,
    max:100,
    message:"Too many requests, please try again Later"
})

app.use(limiter);
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = ['http://localhost:5172', 'http://localhost:5173', 'http://localhost:5174', 'https://06bc792719bf.ngrok-free.app'];
app.use(cors({
    origin:function(requestOrigin , callback){

        if(!requestOrigin || allowedOrigins.includes(requestOrigin)){
            return callback(null, true)
        }
            
        return callback (new Error("Not allowed by CORS"))
        
    },
    credentials:true
}),
);
app.get('/', (req, res) => {
        res.send("Welcome the The Arena of Last BALL. Alhamdulila")
    })

app.use('/pms', patientRoutes);
app.use('/pms', adminRouter);
app.use('/pms', userRoutes)
app.use('/pms', doctorRoutes);
app.use('/pms', slotsRoutes);

(async () => {
    console.log('⚙️ Running slot generator at startup...');
    try{
        await generateAllSlotsStartUp();
        console.log('✅ Initial slots generated!');
    }
    catch(err){
        console.error('Initial slot generation failed:', err)
    }
})();


schedule('0 0 * * *', async() => {
    console.log("Automatic slots generator Running ");
    try{
        await generateAllSlotsStartUp();
    }
    catch(err){
        console.error("Error while generating automatic slots")
    }
})



app.use((err,req,res,next) => {
    console.error(err.stack);
    res.status(500).send('SomeThing Went Wrong')
})

app.listen(Port,() => console.log("port ", Port));


