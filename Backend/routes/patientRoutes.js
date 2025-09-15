import multer from 'multer';
import express from 'express';
import patientDataController from '../Controller/patientController.js';
import { newPatientValidation } from '../middleware/patientValidation.js';
const patientRoutes = express.Router();

const upload = multer();

patientRoutes.post('/addPatientProfile', newPatientValidation, patientDataController.AddNewPatient);
patientRoutes.put('/updatePatientProfile/:id', upload.none(), patientDataController.updatePatientProfile);
patientRoutes.get('/getPatient/:id', patientDataController.getPatient);
patientRoutes.get('/getAllPatientsProfiles', patientDataController.getAllPatients);
patientRoutes.get('/successPayment', patientDataController.paymentSuccess);
patientRoutes.get('/cancelPayment', patientDataController.paymentCancel);
patientRoutes.get('/failedPayment', patientDataController.paymentFailure);
patientRoutes.delete('/deletePatientProfile/:id', patientDataController.deletePatientProfile);
patientRoutes.get('/searchPatient', patientDataController.getSearchPatient);
export default patientRoutes;


