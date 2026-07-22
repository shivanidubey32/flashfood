import express from 'express';
import {
  getListings,
  getListingById,
  createListing,
  getMerchantListings,
  updateListingStatus,
  deleteMerchantListing
} from '../controllers/listingController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.route('/').get(getListings);
// Protected Merchant Routes
router.route('/').post(protect, authorize('Merchant', 'Admin'), createListing);
router.route('/merchant/my-listings').get(protect, authorize('Merchant', 'Admin'), getMerchantListings);
router.route('/:id/status').put(protect, authorize('Merchant', 'Admin'), updateListingStatus);
router.route('/:id').delete(protect, authorize('Merchant', 'Admin'), deleteMerchantListing);

router.route('/:id').get(getListingById);

export default router;
