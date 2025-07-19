import express from 'express';
import { superAdmin } from '../Controller/adminController';

const router = express.Router();


router.post('/superAdmin', superAdmin);