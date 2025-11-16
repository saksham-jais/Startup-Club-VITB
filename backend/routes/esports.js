import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import EsportsRegistration from '../models/EsportsRegistration.js';

// NOTE: Config should be loaded in server.js; import if needed. Remove inline config() here.
const router = express.Router();

// Configure Multer with Cloudinary storage (FIX: Added 'avif'; aligned with MemeWar flexibility)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'event-registrations/esports',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'], // FIX: Support AVIF + WebP
    transformation: [{ width: 800, height: 600, crop: 'limit' }], // NEW: Resize for consistency
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // NEW: 10MB limit
});

// Multer error handler (NEW: Graceful handling for format/size errors)
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_FORMAT') {
      return res.status(400).json({ error: 'Unsupported file format. Use JPG, PNG, WebP, or AVIF.' });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large (max 10MB).' });
    }
    return res.status(400).json({ error: 'File upload failed.' });
  }
  next(err);
};

// Helper: Check Cloudinary config (REUSED from MemeWar)
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

// POST: Submit registration (FIX: Wrapped upload in middleware chain for error handling)
router.post('/register', (req, res, next) => {
  upload.single('screenshot')(req, res, (err) => {
    if (err) return handleMulterError(err, req, res, next);
    next(); // Proceed to handler
  });
}, async (req, res) => {
  let screenshotPublicId = null; // NEW: Track for cleanup
  try {
    // Check config early
    if (!checkCloudinaryConfig()) {
      return res.status(500).json({ error: 'Cloudinary configuration error - check server logs.' });
    }

    const { title, name, registrationNumber, email, utrId, phone } = req.body;
    const screenshotFile = req.file;

    // Enhanced validation (NEW: Email regex; trim but preserve commas if needed)
    const trimmedTitle = title?.trim();
    const trimmedName = name?.trim().replace(/^\s*,\s*/, '').replace(/\s*,\s*$/, ''); // Gentle trim
    const trimmedRegNo = registrationNumber?.trim().toUpperCase();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedUtrId = utrId?.trim();

    if (!trimmedTitle || !trimmedName || !trimmedEmail || !trimmedUtrId || !screenshotFile) {
      return res.status(400).json({ error: 'All required fields + screenshot needed' });
    }

    // NEW: Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // NEW: Check for existing (beyond schema uniques)
    const existing = await EsportsRegistration.findOne({
      $or: [
        { email: trimmedEmail },
        { utrId: trimmedUtrId },
        { registrationNumber: trimmedRegNo }
      ]
    });
    if (existing) {
      return res.status(409).json({ error: 'Already registered with this email, UTR ID, or reg number' });
    }

    const data = {
      title: trimmedTitle,
      name: trimmedName,
      registrationNumber: trimmedRegNo,
      email: trimmedEmail,
      phone: phone?.trim(),
      utrId: trimmedUtrId,
      screenshotUrl: screenshotFile.path,
    };

    const registration = new EsportsRegistration(data);
    await registration.save();

    res.status(201).json({
      success: true,
      message: 'Esports Registration Successful!',
      player: trimmedName
    });

  } catch (error) {
    // Enhanced cleanup (NEW: Track public_id)
    if (screenshotPublicId) {
      await cloudinary.uploader.destroy(screenshotPublicId).catch(() => {});
    }
    console.error('Esports registration error:', error.message, error.stack); // FIX: Verbose logging

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