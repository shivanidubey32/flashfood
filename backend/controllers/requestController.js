import asyncHandler from '../middlewares/asyncHandler.js';
import FoodRequest from '../models/FoodRequest.js';

// @desc    Create a new food request
// @route   POST /api/requests
// @access  Private/NGO (or Admin)
export const createFoodRequest = asyncHandler(async (req, res) => {
  const { community, need, urgency, dateNeeded } = req.body;

  const foodRequest = new FoodRequest({
    ngo: req.user._id, // Assigning it to the currently logged in NGO for now
    community,
    need,
    urgency,
    dateNeeded,
  });

  const createdRequest = await foodRequest.save();
  res.status(201).json(createdRequest);
});

// @desc    Get all requests for logged in NGO
// @route   GET /api/requests
// @access  Private/NGO
export const getFoodRequests = asyncHandler(async (req, res) => {
  const requests = await FoodRequest.find({ ngo: req.user._id }).sort({ createdAt: -1 });
  res.json(requests);
});

// @desc    Update request status (Accept/Decline)
// @route   PUT /api/requests/:id/status
// @access  Private/NGO
export const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const foodRequest = await FoodRequest.findById(req.params.id);

  if (foodRequest) {
    if (foodRequest.ngo.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this request');
    }

    foodRequest.status = status;
    const updatedRequest = await foodRequest.save();
    res.json(updatedRequest);
  } else {
    res.status(404);
    throw new Error('Food request not found');
  }
});
