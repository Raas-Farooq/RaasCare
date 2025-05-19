import { config } from 'dotenv';
import express from 'express';
import ConnectingToDatabase from './config/db.js';
import patientModel from './model/model.js';
import router from './Router/router.js';
import cors from 'cors';
config()



const app = express();

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
        res.send("Welcome the The Arena of Last BALL. Alhamdulila")
    })

app.use('/pms', router);

const Port = 2500;
ConnectingToDatabase()
app.listen(Port,() => console.log("port ", Port));