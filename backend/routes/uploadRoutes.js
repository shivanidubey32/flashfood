import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { protect } from '../middlewares/authMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Multer Memory Storage (No local disk required)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Convert buffer to base64 Data URI
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'flashfood_uploads',
    });

    res.status(200).json({
      message: 'Image Uploaded successfully to Cloudinary',
      image: result.secure_url,
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
});

router.post('/document', protect, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No document provided' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'flashfood_documents',
    });

    res.status(200).json({
      message: 'Document Uploaded successfully to Cloudinary',
      document: result.secure_url,
    });
  } catch (error) {
    console.error('Cloudinary Document Upload Error:', error);
    res.status(500).json({ message: 'Failed to upload document', error: error.message });
  }
});

export default router;
