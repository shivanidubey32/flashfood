import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  sendPhoneOtp,
  verifyPhoneOtp
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.post('/send-otp', protect, sendPhoneOtp);
router.post('/verify-otp', protect, verifyPhoneOtp);

export default router;
