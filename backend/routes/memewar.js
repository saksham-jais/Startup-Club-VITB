import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import MemeWarRegistration from '../models/MemeWarRegistration.js';

const router = express.Router();

// Use memory storage to parse files (UNCHANGED)
const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file
});

// Helper to check config (UNCHANGED)
const checkCloudinaryConfig = () => {
  const config = cloudinary.config();
  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    console.error('Cloudinary config missing/invalid:', {
      cloud_name: config.cloud_name ? 'SET' : 'MISSING',
      api_key: config.api_key ? 'SET' : 'MISSING',
      api_secret: config.api_secret ? 'SET' : 'MISSING'
    });
    return false;
  }
  console.log('Cloudinary config loaded successfully');
  return true;
};

// UPDATED: Helper to upload (FIX: Add allowed_formats for security; better comma preservation)
const uploadFileToCloudinary = (file, folder, isScreenshot = false) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        quality: 'auto',
        use_filename: true,
        unique_filename: true,
        filename: file.originalname,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'], // NEW: Explicit formats (Cloudinary enforces)
      },
      (error, result) => {
        if (error) {
          console.error(`${isScreenshot ? 'Screenshot' : 'Meme'} upload callback error:`, error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const timeout = setTimeout(() => {
      stream.destroy(new Error('Upload timeout'));
      reject(new Error('Upload timeout after 30s'));
    }, 30000);

    stream.on('finish', () => clearTimeout(timeout));
    stream.end(file.buffer);
  });
};

router.post('/register', upload.fields([
  { name: 'screenshot', maxCount: 1 },
  { name: 'memeFile' }
]), async (req, res) => {
  const screenshotFile = req.files?.screenshot?.[0];
  const memeFiles = req.files?.memeFile || [];

  try {
    const { title, name, registrationNumber, email, utrId, phone } = req.body;

    // Enhanced trim (FIX: Preserve internal commas; only strip leading/trailing)
    const trimmedName = (name || '').trim().replace(/^,+|,+$/g, ''); // Remove only leading/trailing commas
    const trimmedRegNo = (registrationNumber || '').trim().toUpperCase().replace(/^,+|,+$/g, '');
    const trimmedEmail = (email || '').trim().toLowerCase().replace(/^,+|,+$/g, '');
    const trimmedUtrId = (utrId || '').trim().replace(/^,+|,+$/g, '');
    const trimmedPhone = (phone || '').trim();

    // Early validation (UNCHANGED, but add email regex)
    if (!title?.trim() || !trimmedName || !trimmedRegNo || !trimmedEmail || !trimmedUtrId || !trimmedPhone) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    if (!screenshotFile) {
      return res.status(400).json({ error: 'Payment screenshot is required' });
    }

    if (memeFiles.length < 1) {
      return res.status(400).json({ error: 'At least 1 meme is required' });
    }

    // NEW: Email regex
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Check Cloudinary (UNCHANGED)
    if (!checkCloudinaryConfig()) {
      return res.status(500).json({ error: 'Cloudinary configuration error - check server logs and .env' });
    }

    // Check existing (UNCHANGED)
    const existing = await MemeWarRegistration.findOne({
      $or: [
        { email: trimmedEmail },
        { utrId: trimmedUtrId },
        { registrationNumber: trimmedRegNo }
      ]
    });

    if (existing) {
      return res.status(409).json({ error: 'Already registered with this email, UTR ID, or registration number' });
    }

    // Upload screenshot (UNCHANGED, but add stack logging on error)
    let screenshotUrl, screenshotPublicId;
    try {
      const result = await uploadFileToCloudinary(screenshotFile, 'event-registrations/memewar/payment', true);
      screenshotUrl = result.secure_url;
      screenshotPublicId = result.public_id;
      console.log('Screenshot filename used:', screenshotFile.originalname);
      console.log('Screenshot uploaded:', screenshotUrl);
    } catch (uploadErr) {
      console.error('Screenshot upload error details:', uploadErr.message, uploadErr.stack); // FIX: Add stack
      return res.status(500).json({ error: 'Failed to upload payment screenshot.' });
    }

    // Upload memes (UNCHANGED, but add stack logging)
    const memes = [];
    const uploadedMemeIds = [];
    try {
      for (const [index, memeFile] of memeFiles.entries()) {
        const result = await uploadFileToCloudinary(memeFile, 'event-registrations/memewar/memes');
        memes.push({
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format
        });
        uploadedMemeIds.push(result.public_id);
        console.log(`Meme ${index + 1} filename used:`, memeFile.originalname);
        console.log(`Meme ${index + 1} uploaded:`, result.secure_url);
      }
    } catch (uploadErr) {
      // Cleanup (UNCHANGED)
      await Promise.all([
        cloudinary.uploader.destroy(screenshotPublicId),
        ...uploadedMemeIds.map(id => cloudinary.uploader.destroy(id))
      ]).catch(err => console.error('Cleanup error:', err));
      console.error('Meme upload error details:', uploadErr.message, uploadErr.stack); // FIX: Add stack
      return res.status(500).json({ error: 'Failed to upload one or more memes.' });
    }

    // Save to DB (UNCHANGED)
    const registration = new MemeWarRegistration({
      title: title.trim(),
      name: trimmedName,
      registrationNumber: trimmedRegNo,
      email: trimmedEmail,
      phone: trimmedPhone,
      utrId: trimmedUtrId,
      screenshotUrl,
      screenshotPublicId,
      memes
    });

    await registration.save();

    res.status(201).json({
      success: true,
      message: `Meme War registration successful! ${memes.length} meme(s) uploaded.`,
      participant: trimmedName
    });

  } catch (error) {
    // Cleanup (UNCHANGED, but ensure screenshotPublicId is defined)
    if (screenshotPublicId) {
      cloudinary.uploader.destroy(screenshotPublicId).catch(() => {});
    }
    uploadedMemeIds.forEach(id => cloudinary.uploader.destroy(id).catch(() => {}));

    console.error('MemeWar registration error:', error.message, error.stack); // FIX: Add stack

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => `${e.path}: ${e.message}`).join(', ');
      return res.status(400).json({ error: `Invalid data: ${errors}` });
    }
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Duplicate entry (e.g., email already used)' });
    }
    res.status(500).json({ error: 'Server error during registration. Check console.' });
  }
});

export default router;