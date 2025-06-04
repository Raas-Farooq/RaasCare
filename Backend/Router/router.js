
import express from 'express';
import patientDataController from '../Controller/controller.js';
import { newPatientValidation } from '../middleware/validators.js';

const router = express.Router();


router.post('/addPatientProfile', newPatientValidation, patientDataController.AddNewPatient);
router.put('/updatePatientProfile/:id', patientDataController.updatePatientProfile);
router.get('/getPatient/:id', patientDataController.getPatient);
router.get('/getAllPatientsProfiles', patientDataController.getAllPatients);
router.delete('/deletePatientProfile/:id', patientDataController.deletePatientProfile);
router.get('/searchPatient', patientDataController.getSearchPatient);
export default router;
