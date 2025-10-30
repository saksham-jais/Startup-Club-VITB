// routes/registration.js (updated for Cloudinary with multer-storage-cloudinary)
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Registration = require('../models/Registration');

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event-registrations/screenshots', // Organize uploads in a folder
    allowed_formats: ['jpg', 'jpeg', 'png'], // Restrict to images
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional: Resize for optimization
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper: Basic email validation (add for security)
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// POST /api/registration/submit - Handle form submission with file upload to Cloudinary
router.post('/submit', upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Screenshot is required' });
    }

    // Extract event data from body
    const { title, description, name, registrationNumber, email, utrId } = req.body;

    if (!title || !description || !name || !registrationNumber || !email || !utrId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // NEW: Validate email format
    if (!isValidEmail(email)) {
      // Clean up if upload happened
      if (req.file && req.file.public_id) {
        await cloudinary.uploader.destroy(req.file.public_id);
      }
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // req.file.path contains the Cloudinary URL
    const screenshotUrl = req.file.path;

    // Save to DB
    const newRegistration = new Registration({
      title,
      description,
      name,
      registrationNumber,
      email,
      utrId,
      screenshotUrl
    });

    await newRegistration.save();

    // NEW: Log success for Vercel monitoring (no PII)
    console.log(`Registration saved: ${newRegistration._id} for event ${title}`);

    res.status(201).json({ 
      message: 'Registration submitted successfully!',
      data: { 
        id: newRegistration._id,  // Return ID for frontend reference
        ...newRegistration.toObject()  // Full doc, but sanitize if needed
      } 
    });
  } catch (error) {
    console.error('Error saving registration:', error);
    
    // If upload failed, delete the file from Cloudinary
    if (req.file && req.file.public_id) {
      await cloudinary.uploader.destroy(req.file.public_id);
    }
    
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// GET /api/registration/:id - Fetch a specific registration (optional)
router.get('/:id', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    // NEW: Sanitize output (hide sensitive fields if needed)
    const { screenshotUrl, ...safeData } = registration.toObject();
    res.json({ ...safeData, screenshotUrl });  // Or full if admin-only
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;