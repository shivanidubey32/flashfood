import express from 'express';
import {
  createDonation,
  getAvailableDonations,
  claimDonation,
  getMyClaimedDonations,
  getMerchantDonations,
  markDonationCompleted
} from '../controllers/donationController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('Merchant', 'Admin'), createDonation)
  .get(protect, authorize('NGO', 'Admin'), getAvailableDonations);

router.route('/merchant').get(protect, authorize('Merchant', 'Admin'), getMerchantDonations);
router.route('/my-claims').get(protect, authorize('NGO', 'Admin'), getMyClaimedDonations);

router.route('/:id/claim').put(protect, authorize('NGO', 'Admin'), claimDonation);
router.route('/:id/complete').put(protect, authorize('NGO', 'Admin'), markDonationCompleted);

export default router;
