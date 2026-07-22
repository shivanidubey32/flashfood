import mongoose from 'mongoose';

const foodListingSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Ref to Merchant role User
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
      required: true,
    },
    quantityAvailable: {
      type: Number,
      required: true,
    },
    dietaryType: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Vegan', 'Mixed'],
      default: 'Veg',
    },
    expiryTime: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Available', 'Sold Out', 'Expired', 'Donated'],
      default: 'Available',
    }
  },
  {
    timestamps: true,
  }
);

const FoodListing = mongoose.model('FoodListing', foodListingSchema);
export default FoodListing;
