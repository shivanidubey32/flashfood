import express from 'express';
import { getVolunteers, addVolunteer, deleteVolunteer } from '../controllers/volunteerController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('NGO'), getVolunteers)
  .post(protect, authorize('NGO'), addVolunteer);

router.route('/:id')
  .delete(protect, authorize('NGO'), deleteVolunteer);

export default router;
