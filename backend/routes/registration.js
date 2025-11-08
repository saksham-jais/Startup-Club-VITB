// routes/registration.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Registration = require('../models/Registration');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// === CLOUDINARY CONFIG ===
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('CLOUDINARY CONFIG MISSING! Check .env file.');
}

// === MULTER STORAGE ===
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event-registrations/screenshots',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// === HELPERS ===
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidSeatRow = (row) => /^[A-Z]$/.test(row);
const isValidSeatColumn = (col) => Number.isInteger(col) && col >= 1 && col <= 20;

// === ADMIN AUTH MIDDLEWARE ===
const adminAuth = async (req, res, next) => {
  if (req.path === '/login') {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
      console.error('Admin credentials not set in .env');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    try {
      const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
      if (username === ADMIN_USERNAME && isMatch) {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1h' });
        return res.json({ message: 'Login successful', token });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // Token verification for other admin routes
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    next();
  } catch (error) {
    console.error('Token invalid:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// === ROUTES ===

// POST /registration/submit
router.post('/submit', upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Payment screenshot required' });

    const {
      title, description, name, registrationNumber,
      email, utrId, seatRow, seatColumn
    } = req.body;

    // ---- VALIDATION ----
    const missing = [];
    ['title','description','name','registrationNumber','email','utrId','seatRow','seatColumn']
      .forEach(f => !req.body[f] && missing.push(f));
    if (missing.length) {
      await cloudinary.uploader.destroy(req.file.public_id).catch(()=>{});
      return res.status(400).json({ error: `Missing: ${missing.join(', ')}` });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      await cloudinary.uploader.destroy(req.file.public_id).catch(()=>{});
      return res.status(400).json({ error: 'Invalid email' });
    }

    if (!/^[A-Z]$/.test(seatRow)) {
      await cloudinary.uploader.destroy(req.file.public_id).catch(()=>{});
      return res.status(400).json({ error: 'Seat row must be A-Z' });
    }

    const col = parseInt(seatColumn);
    if (!Number.isInteger(col) || col < 1 || col > 20) {
      await cloudinary.uploader.destroy(req.file.public_id).catch(()=>{});
      return res.status(400).json({ error: 'Seat column 1-20' });
    }

    const newReg = new Registration({
      title: title.trim(),
      description: description.trim(),
      name: name.trim(),
      registrationNumber: registrationNumber.trim(),
      email: email.trim().toLowerCase(),
      utrId: utrId.trim(),
      screenshotUrl: req.file.path,
      seatRow: seatRow.trim().toUpperCase(),
      seatColumn: col
    });

    await newReg.save();
    res.status(201).json({ message: 'Success', data: { id: newReg._id } });

  } catch (error) {
    if (req.file?.public_id) await cloudinary.uploader.destroy(req.file.public_id).catch(()=>{});
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({ error: field.includes('seat') ? 'Seat already booked' : `${field} already used` });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// GET booked seats
router.get('/booked/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const regs = await Registration.find(
      { title: decodeURIComponent(title) },
      { seatRow: 1, seatColumn: 1, _id: 0 }
    );
    res.json(regs.map(r => ({ row: r.seatRow, col: r.seatColumn })));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch booked seats' });
  }
});

// POST /registration/login (admin)
router.post('/login', adminAuth);

// GET booked seats by event title
router.get('/booked/:title', async (req, res) => {
  try {
    const { title } = req.params;
    if (!title) return res.status(400).json({ error: 'Event title is required' });

    const registrations = await Registration.find(
      { title: decodeURIComponent(title) },
      { seatRow: 1, seatColumn: 1, _id: 0 }
    );

    const booked = registrations.map(r => ({ row: r.seatRow, col: r.seatColumn }));
    res.json(booked);
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    res.status(500).json({ error: 'Failed to fetch booked seats' });
  }
});

// GET all (admin)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const data = await Registration.find().sort({ createdAt: -1 });
    res.json({ message: 'Success', data });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single registration by ID
router.get('/:id', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ error: 'Not found' });

    const { screenshotUrl, ...safe } = registration.toObject();
    res.json({ ...safe, screenshotUrl });
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;