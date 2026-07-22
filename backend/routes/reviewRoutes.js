import express from 'express';
import { createReview, getMerchantReviews, getListingReviews, replyToReview } from '../controllers/reviewController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, authorize('Customer'), createReview);
router.route('/merchant/:merchantId').get(getMerchantReviews);
router.route('/listing/:listingId').get(getListingReviews);
router.route('/:id/reply').put(protect, authorize('Merchant'), replyToReview);

export default router;
