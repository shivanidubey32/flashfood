import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const adminExists = await User.findOne({ email: 'admin@flashfood.com' });

    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit();
    }

    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@flashfood.com',
      password: 'password123', // Will be hashed by pre-save middleware
      role: 'Admin',
      isVerified: true,
    });

    console.log('Admin user seeded successfully!');
    console.log('Email: admin@flashfood.com');
    console.log('Password: password123');
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
