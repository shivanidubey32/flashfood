import asyncHandler from '../middlewares/asyncHandler.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import FoodListing from '../models/FoodListing.js';

// @desc    Check if customer can review a listing
// @route   GET /api/reviews/can-review/:listingId
// @access  Private/Customer
export const canReviewListing = asyncHandler(async (req, res) => {
  const { listingId } = req.params;

  // Check if customer already reviewed this listing
  const alreadyReviewed = await Review.findOne({
    customer: req.user._id,
    listing: listingId
  });

  if (alreadyReviewed) {
    return res.json({ canReview: false, alreadyReviewed: true, review: alreadyReviewed });
  }

  // Check if customer purchased and completed this listing
  const eligibleOrder = await Order.findOne({
    customer: req.user._id,
    'orderItems.listing': listingId,
    status: { $in: ['Completed', 'Ready', 'Accepted'] }
  });

  if (eligibleOrder) {
    return res.json({ canReview: true, alreadyReviewed: false, orderId: eligibleOrder._id });
  }

  res.json({ canReview: false, alreadyReviewed: false });
});

// @desc    Create new verified review
// @route   POST /api/reviews
// @access  Private/Customer
export const createReview = asyncHandler(async (req, res) => {
  const { orderId, listingId, rating, comment } = req.body;

  if (!rating || Number(rating) < 1 || Number(rating) > 5) {
    res.status(400);
    throw new Error('Please provide a valid rating between 1 and 5 stars.');
  }

  if (!comment || !comment.trim()) {
    res.status(400);
    throw new Error('Please provide written review feedback.');
  }

  let targetListingId = listingId;
  let verifiedOrder = null;

  if (orderId) {
    verifiedOrder = await Order.findById(orderId);
    if (!verifiedOrder) {
      res.status(404);
      throw new Error('Order not found');
    }
    if (verifiedOrder.customer.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to review this order');
    }
    if (!targetListingId && verifiedOrder.orderItems?.length > 0) {
      targetListingId = verifiedOrder.orderItems[0].listing;
    }
  } else if (targetListingId) {
    // Find eligible order for this listing
    verifiedOrder = await Order.findOne({
      customer: req.user._id,
      'orderItems.listing': targetListingId,
      status: { $in: ['Completed', 'Ready', 'Accepted'] }
    });
  }

  if (!targetListingId) {
    res.status(400);
    throw new Error('Listing ID is required to review food.');
  }

  const listing = await FoodListing.findById(targetListingId);
  if (!listing) {
    res.status(404);
    throw new Error('Food listing not found');
  }

  // Verify purchase eligibility (must have purchased the food)
  if (!verifiedOrder) {
    res.status(403);
    throw new Error('Only verified customers who ordered this meal can submit a review.');
  }

  // Prevent duplicate reviews for the same listing by the same customer
  const alreadyReviewed = await Review.findOne({
    customer: req.user._id,
    listing: targetListingId
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already submitted a review for this food listing.');
  }

  const review = new Review({
    order: verifiedOrder._id,
    customer: req.user._id,
    merchant: listing.merchant,
    listing: targetListingId,
    rating: Number(rating),
    comment: comment.trim(),
  });

  const createdReview = await review.save();

  // Recalculate dynamic average rating and review count for the listing
  const allListingReviews = await Review.find({ listing: targetListingId });
  const numReviews = allListingReviews.length;
  const avgRating = allListingReviews.reduce((sum, r) => sum + r.rating, 0) / (numReviews || 1);

  await FoodListing.findByIdAndUpdate(targetListingId, {
    rating: parseFloat(avgRating.toFixed(1)),
    numReviews
  });

  const populated = await Review.findById(createdReview._id)
    .populate('customer', 'name profilePicture');

  // Broadcast new review to connected merchants and listing viewers
  if (req.io) {
    req.io.emit(`new-review-${listing.merchant}`, populated);
    req.io.emit(`listing-review-${targetListingId}`, populated);
  }

  res.status(201).json(populated);
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
