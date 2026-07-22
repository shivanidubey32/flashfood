import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodListing',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
    },
    repliedAt: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
