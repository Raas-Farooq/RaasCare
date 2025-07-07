
import express from 'express';
import patientDataController from '../Controller/patientController.js';
import { newPatientValidation } from '../middleware/patientValidation.js';
const patientRoutes = express.Router();

patientRoutes.post('/addPatientProfile', newPatientValidation, patientDataController.AddNewPatient);
patientRoutes.put('/updatePatientProfile/:id', patientDataController.updatePatientProfile);
patientRoutes.get('/getPatient/:id', patientDataController.getPatient);
patientRoutes.get('/getAllPatientsProfiles', patientDataController.getAllPatients);
patientRoutes.delete('/deletePatientProfile/:id', patientDataController.deletePatientProfile);
patientRoutes.get('/searchPatient', patientDataController.getSearchPatient);
export default patientRoutes;
