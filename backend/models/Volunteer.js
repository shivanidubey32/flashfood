import mongoose from 'mongoose';

const volunteerSchema = mongoose.Schema(
  {
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 5.0,
    },
    status: {
      type: String,
      required: true,
      default: 'Active', // Active, Offline, On Delivery
    },
    tasksCompleted: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

export default Volunteer;
