
import express from 'express';
import AddNewPatient from '../Controller/controller.js';


const router = express.Router();


router.post('/addPatient', AddNewPatient);


export default router;