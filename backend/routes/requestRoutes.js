import express from 'express';
import {
  createFoodRequest,
  getFoodRequests,
  updateRequestStatus
} from '../controllers/requestController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('NGO', 'Admin'), createFoodRequest)
  .get(protect, authorize('NGO', 'Admin'), getFoodRequests);

router.route('/:id/status').put(protect, authorize('NGO', 'Admin'), updateRequestStatus);

export default router;
