import express from 'express';

const userRoutes = express.Router();
import { getAllUsers, registerUser, userLogin } from '../Controller/userController.js';
import { loginValidation, registerUserValidation } from '../middleware/userValidation.js';

userRoutes.post('/createNewUser', registerUserValidation, registerUser);
userRoutes.get('/loginUser', loginValidation, userLogin)
userRoutes.get('/getAllUsers', getAllUsers);
export default userRoutes