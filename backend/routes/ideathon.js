import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import IdeathonRegistration from '../models/IdeathonRegistration.js';

const router = express.Router();

// Use memory storage to parse files
const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit per file (for PPT/PDF)
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
  { name: 'submissionFile', maxCount: 1 }
]), async (req, res) => {
  const screenshotFile = req.files?.screenshot?.[0];
  const submissionFile = req.files?.submissionFile?.[0];

  try {
    const { title, teamName, leaderName, leaderRegNo, email, utrId, phone, members: membersStr } = req.body;

    // Trim and normalize
    const trimmedTitle = title?.trim();
    const trimmedTeamName = teamName?.trim();
    const trimmedLeaderName = leaderName?.trim();
    const trimmedLeaderRegNo = leaderRegNo?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedUtrId = utrId?.trim();

    // Parse members JSON
    let parsedMembers = [];
    if (membersStr) {
      try {
        parsedMembers = JSON.parse(membersStr);
        if (!Array.isArray(parsedMembers)) {
          return res.status(400).json({ error: 'Members must be a valid JSON array' });
        }
      } catch (parseErr) {
        return res.status(400).json({ error: 'Invalid members JSON format' });
      }
    }

    // Early validation
    if (!trimmedTitle || !trimmedTeamName || !trimmedLeaderName || !trimmedLeaderRegNo || !trimmedEmail || !trimmedUtrId) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    if (!screenshotFile) {
      return res.status(400).json({ error: 'Payment screenshot is required' });
    }

    if (!submissionFile) {
      return res.status(400).json({ error: 'Submission file (PPT/PDF) is required' });
    }

    // Basic email check (schema has stricter)
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Check Cloudinary config
    if (!checkCloudinaryConfig()) {
      return res.status(500).json({ error: 'Cloudinary configuration error - check server logs and .env' });
    }

    // Check existing
    const existing = await IdeathonRegistration.findOne({
      $or: [
        { 'leader.email': trimmedEmail },
        { utrId: trimmedUtrId }
      ]
    });

    if (existing) {
      return res.status(409).json({ error: 'Already registered with this email or UTR ID' });
    }

    // Validate members count after parsing
    const trimmedMembers = parsedMembers.map(m => ({
      name: m.name?.trim(),
      registrationNumber: m.registrationNumber?.trim(),
    })).filter(m => m.name && m.registrationNumber);

    if (trimmedMembers.length > 5) {
      return res.status(400).json({ error: 'Maximum 5 additional members allowed' });
    }

    // Upload screenshot (image)
    let screenshotUrl, screenshotPublicId;
    try {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'event-registrations/ideathon/payment',
            resource_type: 'image',
            quality: 'auto',
            use_filename: true,        // Preserve original filename
            unique_filename: true,     // Append random suffix if duplicate
            filename: screenshotFile.originalname  // NEW: Explicitly pass original filename for stream uploads
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
      console.log('Screenshot filename used:', screenshotFile.originalname);  // NEW: Debug log
      console.log('Screenshot uploaded:', screenshotUrl); // Now shows original name in path
    } catch (uploadErr) {
      console.error('Screenshot upload error details:', {
        message: uploadErr.message,
        code: uploadErr.http_code || 'N/A',
        status: uploadErr.statusCode || 'N/A'
      });
      return res.status(500).json({ 
        error: 'Failed to upload payment screenshot. Check console for details.' 
      });
    }

    // Upload submission file (raw)
    let submissionUrl, submissionPublicId, submissionFormat;
    try {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'event-registrations/ideathon/submissions',
            resource_type: 'raw',
            use_filename: true,        // Preserve original filename
            unique_filename: true,     // Append random suffix if duplicate
            filename: submissionFile.originalname  // NEW: Explicitly pass original filename for stream uploads
          },
          (error, result) => {
            if (error) {
              console.error('Submission upload callback error:', error);
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
        stream.end(submissionFile.buffer);
      });

      const result = await uploadPromise;
      submissionUrl = result.secure_url;
      submissionPublicId = result.public_id;
      submissionFormat = submissionFile.originalname.split('.').pop().toLowerCase();
      if (!['pdf', 'ppt', 'pptx'].includes(submissionFormat)) {
        throw new Error('Unsupported submission format');
      }
      console.log('Submission filename used:', submissionFile.originalname);  // NEW: Debug log
      console.log('Submission uploaded:', submissionUrl); // Now shows original name in path
    } catch (uploadErr) {
      // Cleanup screenshot
      cloudinary.uploader.destroy(screenshotPublicId).catch(() => {});
      console.error('Submission upload error details:', {
        message: uploadErr.message,
        code: uploadErr.http_code || 'N/A',
        status: uploadErr.statusCode || 'N/A'
      });
      return res.status(500).json({ 
        error: 'Failed to upload submission file. Check console for details.' 
      });
    }

    // Create and save registration
    const registration = new IdeathonRegistration({
      title: trimmedTitle,
      teamName: trimmedTeamName,
      leader: {
        name: trimmedLeaderName,
        registrationNumber: trimmedLeaderRegNo,
        email: trimmedEmail,
        phone: phone?.trim()
      },
      members: trimmedMembers,
      utrId: trimmedUtrId,
      screenshotUrl,
      submissionFile: {
        url: submissionUrl,
        public_id: submissionPublicId,
        format: submissionFormat
      }
    });

    await registration.save();

    res.status(201).json({
      success: true,
      message: 'Ideathon team registered successfully!',
      teamName: registration.teamName
    });

  } catch (error) {
    // Cleanup on errors
    if (screenshotPublicId) {
      cloudinary.uploader.destroy(screenshotPublicId).catch(() => {});
    }
    if (submissionPublicId) {
      cloudinary.uploader.destroy(submissionPublicId, { resource_type: 'raw' }).catch(() => {});
    }

    console.error('Ideathon registration error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => `${e.path}: ${e.message}`).join(', ');
      return res.status(400).json({ error: `Invalid data: ${errors}` });
    }
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Duplicate entry (e.g., email or UTR already used)' });
    }
    res.status(500).json({ error: 'Server error during registration. Check console.' });
  }
});

export default router;