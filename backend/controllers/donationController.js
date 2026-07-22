import asyncHandler from '../middlewares/asyncHandler.js';
import Donation from '../models/Donation.js';

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Private/Merchant
export const createDonation = asyncHandler(async (req, res) => {
  const { title, description, quantityDescription, category, dietaryType, pickupTimeLimit, urgency } = req.body;

  const donation = new Donation({
    merchant: req.user._id,
    title,
    description,
    quantityDescription,
    category,
    dietaryType,
    pickupTimeLimit,
    urgency,
  });

  const createdDonation = await donation.save();
  
  if (req.io) {
    req.io.emit('new-donation', createdDonation);
  }

  res.status(201).json(createdDonation);
});

// @desc    Get all available donations
// @route   GET /api/donations
// @access  Private/NGO
export const getAvailableDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ status: 'Available' })
    .populate('merchant', 'businessName address phoneNumber')
    .sort({ createdAt: -1 });
  res.json(donations);
});

// @desc    Claim a donation
// @route   PUT /api/donations/:id/claim
// @access  Private/NGO
export const claimDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);

  if (donation) {
    if (donation.status !== 'Available') {
      res.status(400);
      throw new Error('Donation is no longer available');
    }

    donation.status = 'Claimed';
    donation.claimedBy = req.user._id;
    donation.claimedAt = Date.now();

    const updatedDonation = await donation.save();
    
    // Notify merchant via socket
    if (req.io) {
      req.io.emit(`donation-claimed-${donation.merchant}`, updatedDonation);
    }
    
    res.json(updatedDonation);
  } else {
    res.status(404);
    throw new Error('Donation not found');
  }
});

// @desc    Mark a donation as completed (picked up)
// @route   PUT /api/donations/:id/complete
// @access  Private/NGO
export const markDonationCompleted = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);

  if (donation) {
    if (donation.status !== 'Claimed') {
      res.status(400);
      throw new Error('Donation is not in claimed state');
    }

    if (donation.claimedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this donation');
    }

    donation.status = 'Completed';
    donation.completedAt = Date.now();

    const updatedDonation = await donation.save();
    
    // Notify merchant via socket
    if (req.io) {
      req.io.emit(`donation-completed-${donation.merchant}`, updatedDonation);
    }
    
    res.json(updatedDonation);
  } else {
    res.status(404);
    throw new Error('Donation not found');
  }
});

// @desc    Get donations claimed by logged in NGO
// @route   GET /api/donations/my-claims
// @access  Private/NGO
export const getMyClaimedDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ claimedBy: req.user._id })
    .populate('merchant', 'businessName address phoneNumber')
    .sort({ claimedAt: -1 });
  
  res.json(donations);
});

// @desc    Get merchant's created donations
// @route   GET /api/donations/merchant
// @access  Private/Merchant
export const getMerchantDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ merchant: req.user._id }).sort({ createdAt: -1 })
    .populate('claimedBy', 'name email');
  res.json(donations);
});
