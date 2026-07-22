import asyncHandler from '../middlewares/asyncHandler.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private/Customer
export const createReview = asyncHandler(async (req, res) => {
  const { orderId, listingId, rating, comment } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Ensure order is completed (picked up) before allowing a review
  if (order.status !== 'Completed') {
    res.status(400);
    throw new Error('You can only review an order after it has been successfully picked up.');
  }

  // Check if customer already reviewed this order
  const alreadyReviewed = await Review.findOne({ order: orderId });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this order');
  }

  const review = new Review({
    order: orderId,
    customer: req.user._id,
    merchant: order.merchant,
    listing: listingId,
    rating: Number(rating),
    comment,
  });

  const createdReview = await review.save();
  res.status(201).json(createdReview);
});

// @desc    Get reviews for a merchant
// @route   GET /api/reviews/merchant/:merchantId
// @access  Public
export const getMerchantReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ merchant: req.params.merchantId })
    .populate('customer', 'name profilePicture')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// @desc    Get reviews for a specific food listing
// @route   GET /api/reviews/listing/:listingId
// @access  Public
export const getListingReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ listing: req.params.listingId })
    .populate('customer', 'name profilePicture')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// @desc    Reply to a review
// @route   PUT /api/reviews/:id/reply
// @access  Private/Merchant
export const replyToReview = asyncHandler(async (req, res) => {
  const { reply } = req.body;
  const review = await Review.findById(req.params.id);

  if (review) {
    if (review.merchant.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to reply to this review');
    }

    review.reply = reply;
    review.repliedAt = Date.now();

    const updatedReview = await review.save();
    res.json(updatedReview);
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
});
