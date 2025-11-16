import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import HackathonRegistration from '../models/HackathonRegistration.js';

const router = express.Router();

// Configure Multer with Cloudinary storage (ADDED 'avif' to allowed_formats)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hackathon_screenshots',
    allowed_formats: ['png', 'jpg', 'jpeg', 'avif'], // Fix: Support AVIF
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
  },
});

const upload = multer({ storage });

// Multer error handler middleware (NEW: Catches upload failures gracefully)
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_FORMAT') {
      return res.status(400).json({ error: 'Unsupported file format. Please use PNG, JPG, JPEG, or AVIF.' });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Max 10MB.' });
    }
    return res.status(400).json({ error: 'File upload failed. Please try again.' });
  }
  next(err); // Pass non-Multer errors to Express
};

// POST /hackathon/register (APPLY error handler)
router.post('/register', (req, res, next) => {
  upload.single('screenshot')(req, res, (err) => {
    if (err) return handleMulterError(err, req, res, next);
    next(); // Proceed if upload succeeds
  });
}, async (req, res) => { // Route handler now only runs post-upload
  try {
    // Parse form fields (multer populates req.body)
    const { title, teamName, leaderName, leaderRegNo, email, utrId, phone, members: membersStr } = req.body;

    // Reconstruct leader object
    const leader = {
      name: leaderName?.trim(),
      registrationNumber: leaderRegNo?.trim(),
      email: email?.toLowerCase().trim(),
      phone: phone?.trim(),
    };

    // Parse members JSON string
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

    // Validation
    if (!title?.trim() || !teamName?.trim() || !leader.name || !leader.registrationNumber || !leader.email || !utrId?.trim()) {
      return res.status(400).json({ error: 'All required fields must be filled (title, teamName, leader details, utrId)' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Payment screenshot is required' });
    }

    const screenshotUrl = req.file.path; // Cloudinary URL

    // Check for existing registration
    const existing = await HackathonRegistration.findOne({
      $or: [
        { 'leader.email': leader.email },
        { utrId: utrId.trim() }
      ]
    });

    if (existing) {
      return res.status(409).json({ error: 'Team already registered with this email or UTR ID' });
    }

    // Trim members
    const trimmedMembers = parsedMembers.map(m => ({
      name: m.name?.trim(),
      registrationNumber: m.registrationNumber?.trim(),
    })).filter(m => m.name && m.registrationNumber); // Filter out invalid members

    if (trimmedMembers.length > 5) {
      return res.status(400).json({ error: 'Maximum 5 additional members allowed' });
    }

    // Create and save registration
    const registration = new HackathonRegistration({
      title: title.trim(),
      teamName: teamName.trim(),
      leader,
      members: trimmedMembers,
      utrId: utrId.trim(),
      screenshotUrl,
    });

    await registration.save();

    res.status(201).json({
      success: true,
      message: 'Hackathon team registered successfully!',
      teamName: registration.teamName,
      id: registration._id,
    });
  } catch (error) {
    console.error('Hackathon registration error:', error.message, error.stack); // IMPROVED: More verbose logging
    res.status(500).json({ error: 'Server error during registration' });
  }
});

export default router;