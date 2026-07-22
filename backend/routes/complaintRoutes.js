import express from 'express';
import { createComplaint } from '../controllers/complaintController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createComplaint);

export default router;
