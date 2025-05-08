import { config } from 'dotenv';
import express from 'express';
import ConnectingToDatabase from './config/db.js';
import patientModel from './model/model.js';
import router from './Router/router.js';
config()



const app = express();

app.use(express.json());

app.get('/', (req, res) => {
        res.send("Welcome the The Arena of Last BALL. Alhamdulila")
    })

app.use('/pms', router);

const Port = 2500;
console.log("process.env.MONGO ", process.env.MONGO_URI);
ConnectingToDatabase()
app.listen(Port,() => console.log("port ", Port));