import asyncHandler from '../middlewares/asyncHandler.js';
import Complaint from '../models/Complaint.js';

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private
export const createComplaint = asyncHandler(async (req, res) => {
  const { subject, description } = req.body;

  if (!subject || !description) {
    res.status(400);
    throw new Error('Please provide subject and description');
  }

  const complaint = await Complaint.create({
    user: req.user._id,
    subject,
    description,
  });

  if (complaint) {
    res.status(201).json(complaint);
  } else {
    res.status(400);
    throw new Error('Invalid complaint data');
  }
});
