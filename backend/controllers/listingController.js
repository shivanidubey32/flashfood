import asyncHandler from '../middlewares/asyncHandler.js';
import FoodListing from '../models/FoodListing.js';

// @desc    Get all active food listings (Nearby Discovery)
// @route   GET /api/listings
// @access  Public
export const getListings = asyncHandler(async (req, res) => {
  // Can add geo-spatial queries here later based on merchant address
  const listings = await FoodListing.find({ status: 'Available' })
    .populate('merchant', 'name businessName address')
    .sort({ createdAt: -1 });
  res.json(listings);
});

// @desc    Get single food listing by ID
// @route   GET /api/listings/:id
// @access  Public
export const getListingById = asyncHandler(async (req, res) => {
  const listing = await FoodListing.findById(req.params.id)
    .populate('merchant', 'name businessName address phoneNumber');
  
  if (listing) {
    res.json(listing);
  } else {
    res.status(404);
    throw new Error('Food listing not found');
  }
});

// @desc    Create a new food listing
// @route   POST /api/listings
// @access  Private/Merchant
export const createListing = asyncHandler(async (req, res) => {
  const { title, description, category, originalPrice, discountedPrice, quantityAvailable, dietaryType, expiryTime, image } = req.body;

  const listing = new FoodListing({
    merchant: req.user._id,
    title,
    description,
    category,
    originalPrice,
    discountedPrice,
    quantityAvailable,
    dietaryType,
    expiryTime,
    image,
    status: 'Available'
  });

  const createdListing = await listing.save();
  res.status(201).json(createdListing);
});

// @desc    Get merchant's own listings
// @route   GET /api/listings/merchant
// @access  Private/Merchant
export const getMerchantListings = asyncHandler(async (req, res) => {
  const listings = await FoodListing.find({ merchant: req.user._id }).sort({ createdAt: -1 });
  res.json(listings);
});
// @desc    Update a listing's status
// @route   PUT /api/listings/:id/status
// @access  Private/Merchant
export const updateListingStatus = asyncHandler(async (req, res) => {
  const listing = await FoodListing.findById(req.params.id);
  if (listing && listing.merchant.toString() === req.user._id.toString()) {
    listing.status = req.body.status || listing.status;
    const updatedListing = await listing.save();
    res.json(updatedListing);
  } else {
    res.status(404);
    throw new Error('Listing not found or unauthorized');
  }
});

// @desc    Delete a merchant's listing
// @route   DELETE /api/listings/:id
// @access  Private/Merchant
export const deleteMerchantListing = asyncHandler(async (req, res) => {
  const listing = await FoodListing.findById(req.params.id);
  if (listing && listing.merchant.toString() === req.user._id.toString()) {
    await listing.deleteOne();
    res.json({ message: 'Listing removed successfully' });
  } else {
    res.status(404);
    throw new Error('Listing not found or unauthorized');
  }
});
