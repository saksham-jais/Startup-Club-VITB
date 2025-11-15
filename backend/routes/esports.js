// routes/esports.js
import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import EsportsRegistration from '../models/EsportsRegistration.js';
import { config } from 'dotenv';
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'event-registrations/esports',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});

const upload = multer({ storage });

const router = express.Router();

// POST: Submit registration
router.post('/register', upload.single('screenshot'), async (req, res) => {
  try {
    const { title, name, registrationNumber, email, utrId } = req.body;
    const screenshotFile = req.file;

    if (!title || !name?.trim() || !email?.trim() || !utrId?.trim() || !screenshotFile) {
      if (screenshotFile) await cloudinary.uploader.destroy(screenshotFile.public_id).catch(() => {});
      return res.status(400).json({ error: 'All required fields + screenshot needed' });
    }

    const data = {
      title: title.trim(),
      name: name.trim(),
      registrationNumber: registrationNumber?.trim() || null,
      email: email.trim().toLowerCase(),
      utrId: utrId.trim(),
      screenshotUrl: screenshotFile.path,
    };

    const registration = new EsportsRegistration(data);
    await registration.save();

    res.status(201).json({
      success: true,
      message: 'Esports Registration Successful!',
      player: name.trim()
    });

  } catch (error) {
    if (req.file?.public_id) {
      cloudinary.uploader.destroy(req.file.public_id).catch(() => {});
    }
    console.error('Esports registration error:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const msg = field === 'email' ? 'Email already registered' :
                  field === 'utrId' ? 'UTR ID already used' :
                  'Registration number already used';
      return res.status(409).json({ error: msg });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;