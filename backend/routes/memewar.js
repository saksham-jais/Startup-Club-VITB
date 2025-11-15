import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import MemeWarRegistration from '../models/MemeWarRegistration.js';

const router = express.Router();

// Use memory storage to parse files
const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file
});

// Helper to check config
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

router.post('/register', upload.fields([
  { name: 'screenshot', maxCount: 1 },
  { name: 'memeFile', maxCount: 3 } // Enforce 3 max
]), async (req, res) => {
  const screenshotFile = req.files?.screenshot?.[0];
  const memeFiles = req.files?.memeFile || [];

  try {
    const { title, name, registrationNumber, email, utrId } = req.body;

    // Trim and normalize (remove trailing commas/spaces)
    const trimmedName = (name || '').trim().replace(/,+$/, '');
    const trimmedRegNo = (registrationNumber || '').trim().toUpperCase().replace(/,+$/, '');
    const trimmedEmail = (email || '').trim().toLowerCase().replace(/,+$/, '');
    const trimmedUtrId = (utrId || '').trim().replace(/,+$/, '');

    // Early validation
    if (!title?.trim() || !trimmedName || !trimmedRegNo || !trimmedEmail || !trimmedUtrId) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    if (!screenshotFile) {
      return res.status(400).json({ error: 'Payment screenshot is required' });
    }

    if (memeFiles.length < 1 || memeFiles.length > 3) {
      return res.status(400).json({ error: '1–3 memes are required' });
    }

    // Basic email check
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Check Cloudinary config before any uploads
    if (!checkCloudinaryConfig()) {
      return res.status(500).json({ error: 'Cloudinary configuration error - check server logs and .env' });
    }

    // Check existing
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

    // Upload screenshot with timeout (removed format: 'auto')
    let screenshotUrl, screenshotPublicId;
    try {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'event-registrations/memewar/payment',
            resource_type: 'image',
            quality: 'auto'
          },
          (error, result) => {
            if (error) {
              console.error('Screenshot upload callback error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        // Add timeout
        const timeout = setTimeout(() => {
          stream.destroy(new Error('Upload timeout'));
          reject(new Error('Upload timeout after 30s'));
        }, 30000);

        stream.on('finish', () => clearTimeout(timeout));
        stream.end(screenshotFile.buffer);
      });

      const result = await uploadPromise;
      screenshotUrl = result.secure_url;
      screenshotPublicId = result.public_id;
      console.log('Screenshot uploaded:', screenshotUrl);
    } catch (uploadErr) {
      console.error('Screenshot upload error details:', {
        message: uploadErr.message,
        code: uploadErr.http_code || 'N/A',
        status: uploadErr.statusCode || 'N/A'
      });
      return res.status(500).json({ 
        error: 'Failed to upload payment screenshot. Check console for details (likely config or network).' 
      });
    }

    // Upload memes (sequential, removed format: 'auto')
    const memes = [];
    const uploadedMemeIds = [];
    try {
      for (const [index, memeFile] of memeFiles.entries()) {
        const uploadPromise = new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'event-registrations/memewar/memes',
              resource_type: 'image',
              quality: 'auto'
            },
            (error, result) => {
              if (error) {
                console.error(`Meme ${index + 1} upload callback error:`, error);
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
          stream.end(memeFile.buffer);
        });

        const result = await uploadPromise;
        memes.push({
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format
        });
        uploadedMemeIds.push(result.public_id);
        console.log(`Meme ${index + 1} uploaded:`, result.secure_url);
      }
    } catch (uploadErr) {
      // Cleanup screenshot and any partial memes
      await Promise.all([
        cloudinary.uploader.destroy(screenshotPublicId),
        ...uploadedMemeIds.map(id => cloudinary.uploader.destroy(id))
      ]).catch(err => console.error('Cleanup error:', err));
      console.error('Meme upload error details:', {
        message: uploadErr.message,
        code: uploadErr.http_code || 'N/A',
        status: uploadErr.statusCode || 'N/A'
      });
      return res.status(500).json({ 
        error: 'Failed to upload one or more memes. Check console for details.' 
      });
    }

    // Save to DB
    const registration = new MemeWarRegistration({
      title: title.trim(),
      name: trimmedName,
      registrationNumber: trimmedRegNo,
      email: trimmedEmail,
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
    // Cleanup uploads on DB/other errors
    if (screenshotPublicId) {
      cloudinary.uploader.destroy(screenshotPublicId).catch(() => {});
    }
    uploadedMemeIds.forEach(id => cloudinary.uploader.destroy(id).catch(() => {}));

    console.error('MemeWar registration error:', error);

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