import mongoose from 'mongoose';

const foodRequestSchema = new mongoose.Schema(
  {
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    community: {
      type: String,
      required: true,
    },
    need: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    dateNeeded: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined', 'Completed'],
      default: 'Pending',
    }
  },
  {
    timestamps: true,
  }
);

const FoodRequest = mongoose.model('FoodRequest', foodRequestSchema);
export default FoodRequest;
