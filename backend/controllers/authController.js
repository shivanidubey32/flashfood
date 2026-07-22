import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phoneNumber, businessName, businessType, ngoRegistrationNumber } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    phoneNumber,
    businessName,
    businessType,
    ngoRegistrationNumber,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      address: user.address?.street || '',
      businessDescription: user.businessDescription || '',
      verificationDocuments: user.verificationDocuments || [],
      isVerified: user.isVerified,
      isPhoneVerified: user.isPhoneVerified,
      notificationPreferences: user.notificationPreferences,
      merchantPreferences: user.merchantPreferences,
      customerPreferences: user.customerPreferences,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    
    if (req.body.phoneNumber) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(req.body.phoneNumber)) {
        res.status(400);
        throw new Error('Please enter a valid 10-digit mobile number');
      }
      if (user.phoneNumber !== req.body.phoneNumber) {
        user.isPhoneVerified = false;
      }
      user.phoneNumber = req.body.phoneNumber;
    }
    
    if (req.body.address) {
      if (!user.address) {
        user.address = { street: req.body.address };
      } else {
        user.address.street = req.body.address;
      }
    }
    
    if (req.body.businessDescription !== undefined) {
      user.businessDescription = req.body.businessDescription;
    }

    if (req.body.verificationDocuments) {
      user.verificationDocuments = req.body.verificationDocuments;
    }

    if (req.body.password) {
      if (!req.body.currentPassword) {
        res.status(401);
        throw new Error('Current password is required to change password');
      }
      const isMatch = await user.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        res.status(401);
        throw new Error('Incorrect current password');
      }
      user.password = req.body.password;
    }

    if (req.body.profilePicture) {
      user.profilePicture = req.body.profilePicture;
    }

    if (req.body.notificationPreferences) {
      user.notificationPreferences = req.body.notificationPreferences;
    }
    
    if (req.body.merchantPreferences) {
      user.merchantPreferences = req.body.merchantPreferences;
    }
    
    if (req.body.customerPreferences) {
      user.customerPreferences = req.body.customerPreferences;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phoneNumber: updatedUser.phoneNumber,
      profilePicture: updatedUser.profilePicture,
      address: updatedUser.address?.street || '',
      businessDescription: updatedUser.businessDescription || '',
      verificationDocuments: updatedUser.verificationDocuments || [],
      isVerified: updatedUser.isVerified,
      isPhoneVerified: updatedUser.isPhoneVerified,
      notificationPreferences: updatedUser.notificationPreferences,
      merchantPreferences: updatedUser.merchantPreferences,
      customerPreferences: updatedUser.customerPreferences,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Send phone OTP
// @route   POST /api/auth/send-otp
// @access  Private
export const sendPhoneOtp = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (!user.phoneNumber) {
      res.status(400);
      throw new Error('Please save your phone number first');
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.phoneOtp = otp;
    user.phoneOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    
    await user.save();

    // Mock SMS Service - Log to console
    console.log(`\n\n=========================================`);
    console.log(`🚀 [MOCK SMS SERVER] Sending SMS to ${user.phoneNumber}`);
    console.log(`💬 Message: Your FlashFood verification code is: ${otp}`);
    console.log(`=========================================\n\n`);

    res.json({ message: 'OTP sent successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Verify phone OTP
// @route   POST /api/auth/verify-otp
// @access  Private
export const verifyPhoneOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    if (!user.phoneOtp || !user.phoneOtpExpiry) {
      res.status(400);
      throw new Error('No OTP requested or OTP expired');
    }

    if (Date.now() > user.phoneOtpExpiry) {
      res.status(400);
      throw new Error('OTP has expired. Please request a new one.');
    }

    if (user.phoneOtp === otp) {
      user.isPhoneVerified = true;
      user.phoneOtp = undefined;
      user.phoneOtpExpiry = undefined;
      
      const updatedUser = await user.save();

      res.json({
        message: 'Phone number verified successfully',
        isPhoneVerified: updatedUser.isPhoneVerified
      });
    } else {
      res.status(400);
      throw new Error('Invalid OTP');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
