import { config } from 'dotenv';
import express from 'express';
import ConnectingToDatabase from './config/db.js';
import patientRoutes from './routes/patientRoutes.js';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import cookieParser from 'cookie-parser';
config()



const app = express();

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = ['http://localhost:5172', 'http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
    origin:function(requestOrigin , callback){
        if(!requestOrigin) callback(null, true)

        if(allowedOrigins.includes(requestOrigin)){
            callback(null, true)
        }else{
            callback (new Error(null, "No origin defined"))
        }
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
// app.get('/', (req, res) => {
//   console.log('Received cookies:', req.cookies);
//   res.send('Check your server logs');
// });
const Port = 2500;
ConnectingToDatabase()
app.listen(Port,() => console.log("port ", Port));