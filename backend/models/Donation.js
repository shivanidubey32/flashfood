import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantityDescription: {
      type: String,
      required: true, // e.g. "50 boxed meals", "20kg rice"
    },
    category: {
      type: String,
      required: true,
    },
    dietaryType: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Vegan', 'Mixed'],
      required: true,
    },
    pickupTimeLimit: {
      type: Date,
      required: true,
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Available', 'Claimed', 'Completed', 'Expired'],
      default: 'Available',
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // The NGO user
    },
    claimedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;
