import { config } from 'dotenv';
import express from 'express';
import ConnectingToDatabase from './config/db.js';
import patientRoutes from './routes/patientRoutes.js';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import cookieParser from 'cookie-parser';
import doctorRoutes from './routes/doctorRoutes.js';
import slotsRoutes from './routes/availableSlotRoutes.js';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { schedule } from 'node-cron';
import { generateAllSlotsStartUp, runDailySlotMaintenance, updateAllSlots } from './Controller/slotsController.js';
import errorHandler from './middleware/errorHandler.js';
import removeDuplicates from './Controller/slotsDeleteAndUpdate.js';


config()

const app = express();
const Port = process.env.PORT || 2500;
ConnectingToDatabase();

const allowedOrigins = ['http://localhost:5172', 'http://localhost:5173', 'http://localhost:5174', 'https://raas-care.vercel.app', 'http://172.17.117.48:5173', 'http://172.17.117.48:5174'];
const corsAuthen = {
    origin:function(requestOrigin , callback){

        if(!requestOrigin || allowedOrigins.includes(requestOrigin)){
            return callback(null, true)
        }
        return callback (new Error("Not allowed by CORS"))
        
    },
    credentials:true
}

app.use(cors(corsAuthen));
app.options(/.*/, cors(corsAuthen));


app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
const limiter = rateLimit({
    windowMs:15 * 60 * 1000,
    max:300,
    standardHeaders:true,
    legacyHeaders:false,
    message:"Too many requests, please try again Later"
})

app.use(limiter);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
        res.send("Welcome the The Arena of Last BALL. Alhamdulila")
    })

app.use('/pms', patientRoutes);
app.use('/pms', adminRouter);
app.use('/pms', userRoutes)
app.use('/pms', doctorRoutes);
app.use('/pms', slotsRoutes);

// (async () => {
//     console.log('⚙️ Running slot generator at startup...');
//     try{
//         await generateAllSlotsStartUp();
//         console.log('✅ Initial slots generated!');
//     }
//     catch(err){
//         console.error('Initial slot generation failed:', err)
//     }
// })();


schedule('0 0 * * *', async() => {
    console.log("Automatic slots generator Running ");
    try{
        await generateAllSlotsStartUp();
    }
    catch(err){
        console.error("Error while generating automatic slots")
    }
})

// setInterval(runDailySlotMaintenance, 24 * 60 * 60 * 1000);

// Run immediately on startup (with delay to let DB connect)
// setTimeout(runDailySlotMaintenance, 10000);


app.use(errorHandler);

app.use((err,req,res,next) => {
    console.error("Global Error ",err.stack);
    res.status(err.status||500)
    .json({
        success:false,
        message: err.message || 'Internal server error'
    })
})

// await removeDuplicatess();

app.listen(Port,() => console.log("port ", Port));


// 1114
// : 
// {slotDate: {…}, _id: '69376683779b626456b40fe8', doctorId: '68ea0a1da5830a9842e64462', patientId: null, slotTime: '10:00-10:30 AM', …}
// 1115
// : 
// createdAt
// : 
// "2025-12-09T00:00:03.529Z"
// doctorId
// : 
// "68ea0ab4a5830a9842e64469"
// doctorName
// : 
// "Ijaz Hassan"
// doctorSpeciality
// : 
// "Surgeon"
// isBooked
// : 
// false
// isCancelled
// : 
// false
// isCompleted
// : 
// false
// patientId
// : 
// null
// patientName
// : 
// ""
// slotDate
// : 
// {startDate: '2025-12-22T09:00:00.000Z', endDate: '2025-12-22T09:30:00.000Z'}
// slotDay
// : 
// "2025-12-22"
// slotKey
// : 
// "68ea0ab4a5830a9842e64469_2025-12-22_9:00-9:30 AM"
// slotTime
// : 
// "9:00-9:30 AM"
// source
// : 
// "template"
// updatedAt
// : 
// "2025-12-15T12:00:08.561Z"
// __v
// : 
// 0
// _id
// : 
// "69376683779b626456b40feb"
// [[Prototype]]
// : 
// Object
// 1116
// : 
// {slotDate: {…}, _id: '69376683779b626456b40fec', doctorId: '68ea0ab4a5830a9842e64469', patientId: null, slotTime: '9:30-10:00 AM', …}
// 1117
// : 
// {slotDate: {…}, _id: '69376683779b626456b40ff5', doctorId: '68ea0ab4a5830a9842e64469', patientId: null, slotTime: '06:00 PM', …}
// 1118
// : 
// {slotDate: {…}, _id: '69376683779b626456b40fed', doctorId: '68ea0ab4a5830a9842e64469', patientId: null, slotTime: '10:00-10:30 AM', …}
// 1119
// : 
// {slotDate: {…}, _id: '69376683779b626456b40fee', doctorId: '68ea0ab4a5830a9842e64469', patientId: null, slotTime: '10:30-11:00 AM', …}
// 1120
// : 
// createdAt
// : 
// "2025-12-09T00:00:03.530Z"
// doctorId
// : 
// "68ea0ab4a5830a9842e64469"
// doctorName
// : 
// "Ijaz Hassan"
// doctorSpeciality
// : 
// "Surgeon"
// isBooked
// : 
// false
// isCancelled
// : 
// false
// isCompleted
// : 
// false
// patientId
// : 
// null
// patientName
// : 
// ""
// slotDate
// : 
// {startDate: '2025-12-20T11:00:00.000Z', endDate: '2025-12-20T11:30:00.000Z'}
// slotDay
// : 
// "2025-12-20"
// slotKey
// : 
// "68ea0ab4a5830a9842e64469_2025-12-20_11:00-11:30 AM"
// slotTime
// : 
// "11:00-11:30 AM"
// source
// : 
// "template"
// updatedAt
// : 
// "2025-12-15T12:00:09.075Z"
// __v
// : 
// 0
// _id
// : 
// "69376683779b626456b40fef"
// [[Prototype]]
// : 
// Object