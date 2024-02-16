import express from 'express';
import * as UserController from '../controllers/userController.js';
const router = express.Router();
// Public Routes
router.post('/register', UserController.userRegistration);
router.post('/login', UserController.userLogin);
export default router;
