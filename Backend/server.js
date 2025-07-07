import { config } from 'dotenv';
import express from 'express';
import ConnectingToDatabase from './config/db.js';
import patientRoutes from './routes/patientRoutes.js';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
config()



const app = express();

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
        res.send("Welcome the The Arena of Last BALL. Alhamdulila")
    })

app.use('/pms', patientRoutes);
app.use('/pms', userRoutes)
const Port = 2500;
ConnectingToDatabase()
app.listen(Port,() => console.log("port ", Port));