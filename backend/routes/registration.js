const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Registration = require('../models/Registration');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// Log environment variables for debugging (remove in production)
console.log('ENV:', {
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
  JWT_SECRET: process.env.JWT_SECRET ? '[REDACTED]' : undefined,
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event-registrations/screenshots',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper: Basic email validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  console.log(`AdminAuth called: ${req.method} ${req.path}`); // DEBUG: Confirm route hit

  if (req.path === '/login') {
    const { username, password } = req.body;
    console.log('Login attempt:', { username: username ? 'provided' : 'missing', password: password ? 'provided' : 'missing' }); // Sanitized debug
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const ADMIN_CREDENTIALS = {
      username: process.env.ADMIN_USERNAME,
      passwordHash: process.env.ADMIN_PASSWORD_HASH,
    };

    try {
      const isMatch = await bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash);
      console.log('Password match:', isMatch); // Debug
      if (username === ADMIN_CREDENTIALS.username && isMatch) {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Generated token starts with:', token ? token.substring(0, 20) + '...' : 'null'); // DEBUG
        return res.json({ message: 'Login successful', token });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Server error during login' });
    }
  }

  // Protect other routes
  const authHeader = req.header('Authorization');
  console.log('Received auth header:', authHeader ? authHeader.substring(0, 30) + '...' : 'none'); // DEBUG
  const token = authHeader?.replace('Bearer ', '');
  console.log('Extracted token starts with:', token ? token.substring(0, 20) + '...' : 'null/empty'); // DEBUG

  if (!token) {
    console.log('No token provided'); // DEBUG
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully for user:', decoded.role); // DEBUG
    next();
  } catch (error) {
    console.error('Token verification error:', error.message); // DEBUG: Will show exact error (e.g., "invalid signature")
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// POST /registration/submit
router.post('/submit', upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Screenshot is required' });
    }

    const { title, description, name, registrationNumber, email, utrId } = req.body;

    if (!title || !description || !name || !registrationNumber || !email || !utrId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!isValidEmail(email)) {
      if (req.file && req.file.public_id) {
        await cloudinary.uploader.destroy(req.file.public_id);
      }
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const screenshotUrl = req.file.path;

    const newRegistration = new Registration({
      title,
      description,
      name,
      registrationNumber,
      email,
      utrId,
      screenshotUrl,
    });

    await newRegistration.save();

    console.log(`Registration saved: ${newRegistration._id} for event ${title}`);

    res.status(201).json({
      message: 'Registration submitted successfully!',
      data: { id: newRegistration._id, ...newRegistration.toObject() },
    });
  } catch (error) {
    console.error('Error saving registration:', error);
    if (req.file && req.file.public_id) {
      await cloudinary.uploader.destroy(req.file.public_id);
    }
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /registration/login
router.post('/login', adminAuth);

// GET /registration/all (MOVED BEFORE /:id to fix route matching)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.json({
      message: 'Registrations fetched successfully',
      data: registrations,
    });
  } catch (error) {
    console.error('Error fetching all registrations:', error);
    res.status(500).json({ error: 'Server error fetching registrations' });
  }
});

// GET /registration/:id (NOW AFTER /all)
router.get('/:id', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    const { screenshotUrl, ...safeData } = registration.toObject();
    res.json({ ...safeData, screenshotUrl });
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;