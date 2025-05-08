
import express from 'express';
import {AddNewPatient} from '../Controller/controller.jsx'

const router = express.Router();


router.post('/addPatient', AddNewPatient);


export default router;