import Volunteer from '../models/Volunteer.js';

// @desc    Get all volunteers for logged in NGO
// @route   GET /api/volunteers
// @access  Private/NGO
const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ ngoId: req.user._id }).sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch volunteers', error: error.message });
  }
};

// @desc    Add a new volunteer
// @route   POST /api/volunteers
// @access  Private/NGO
const addVolunteer = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Please provide name and phone number' });
    }

    const volunteer = await Volunteer.create({
      ngoId: req.user._id,
      name,
      phone,
    });

    res.status(201).json(volunteer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add volunteer', error: error.message });
  }
};

// @desc    Delete a volunteer
// @route   DELETE /api/volunteers/:id
// @access  Private/NGO
const deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    if (volunteer.ngoId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this volunteer' });
    }

    await Volunteer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Volunteer removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete volunteer', error: error.message });
  }
};

export { getVolunteers, addVolunteer, deleteVolunteer };
