import express from 'express';
import multer from 'multer';

const upload = multer();
const userRoutes = express.Router();
import { getAllUsers, registerUser, userLogin } from '../Controller/userController.js';
import { loginValidation, registerUserValidation } from '../middleware/userValidation.js';
import Authenticate from '../authentication/Authenticate.js';

userRoutes.post('/createNewUser', registerUserValidation, registerUser);
userRoutes.post('/loginUser', upload.none(), loginValidation,userLogin)
userRoutes.get('/getAllUsers', getAllUsers);
export default userRoutes

// why removing 'Authenticate' from login route