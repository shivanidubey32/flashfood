import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { protect } from '../middlewares/authMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'flashfood_uploads',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx'],
    };
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/', protect, upload.single('image'), (req, res) => {
  res.send({
    message: 'Image Uploaded successfully to Cloudinary',
    // Cloudinary returns the full absolute URL in req.file.path
    image: req.file.path,
  });
});

router.post('/document', protect, upload.single('document'), (req, res) => {
  res.send({
    message: 'Document Uploaded successfully to Cloudinary',
    document: req.file.path,
  });
});

export default router;
