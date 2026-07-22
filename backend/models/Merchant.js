import mongoose from 'mongoose';

const merchantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  businessName: {
    type: String,
    required: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  fssaiLicense: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Merchant = mongoose.model('Merchant', merchantSchema);

export default Merchant;
