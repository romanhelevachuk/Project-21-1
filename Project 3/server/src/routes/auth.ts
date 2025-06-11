import express from 'express';
import { Router } from 'express';
import { register, login } from '../controllers/auth';

const router: Router = express.Router();

// Register new user
router.post('/register', register);

// Login user
router.post('/login', login);

export default router; 