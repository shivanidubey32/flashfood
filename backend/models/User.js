import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Customer', 'Merchant', 'NGO', 'Admin'],
      default: 'Customer',
    },
    phoneNumber: {
      type: String,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    phoneOtp: {
      type: String,
    },
    phoneOtpExpiry: {
      type: Date,
    },
    profilePicture: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      }
    },
    // Merchant Specific
    businessName: String,
    businessType: {
      type: String,
      enum: ['Restaurant', 'Bakery', 'Supermarket', 'Cafe', 'Other'],
    },
    businessDescription: String,
    // NGO Specific
    ngoRegistrationNumber: String,
    verificationDocuments: [{
      name: String,
      url: String,
      uploadedAt: { type: Date, default: Date.now },
      status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' }
    }],
    isVerified: {
      type: Boolean,
      default: false, // NGOs and Merchants must be verified
    },
    isBlocked: {
      type: Boolean,
      default: false, // For admin to block/suspend users
    },
    notificationPreferences: {
      orderAlerts: { type: Boolean, default: true },
      promotions: { type: Boolean, default: false },
      donationAlerts: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true }
    },
    merchantPreferences: {
      autoAcceptOrders: { type: Boolean, default: false },
      payoutMethod: { type: String, default: 'Bank Transfer' }
    },
    customerPreferences: {
      locationTracking: { type: Boolean, default: false },
      darkMode: { type: Boolean, default: false }
    },
  },
  {
    timestamps: true,
  }
);

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
