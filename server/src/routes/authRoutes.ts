import express from 'express';
import { authController } from '../controllers/authController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

// Firebase authentication endpoint
router.post('/firebase', authController.handleFirebaseAuth);

// Test endpoint to verify authentication
router.get('/me', authenticateUser, (req, res) => {
  res.json({ user: req.user });
});

export default router;
