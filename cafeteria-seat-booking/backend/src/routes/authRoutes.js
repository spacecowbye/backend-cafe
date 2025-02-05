// src/routes/authRoutes.js
import express from 'express';
import { signUp, login } from '../controllers/authControllers.js';

const router = express.Router();

// Route for signing up a user
router.post('/sign-up', signUp);

// Route for logging in a user
router.post('/login', login);

export default router;
