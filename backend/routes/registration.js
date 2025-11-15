// routes/registration.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// === IMPORT ALL 7 MODELS ===
const PodcastRegistration              = require('../models/PodcastRegistration');
const HackathonRegistration            = require('../models/HackathonRegistration');
const MemeWarRegistration              = require('../models/MemeWarRegistration');
const IdeathonRegistration             = require('../models/IdeathonRegistration');
const EsportsRegistration              = require('../models/EsportsRegistration');
const CulturalPerformanceRegistration  = require('../models/CulturalPerformanceRegistration');
const StandupRegistration              = require('../models/StandupRegistration');

// === SEATED EVENTS CONFIG (Add any event title that has seats) ===
const seatedEvents = new Set([
  'S²-25 - StartUp Synergy',
  'Standup Comedy Night',           // Your seated standup event
  'Standup Show',                   // Add variations if needed
  'Standup Comedy - Final Round',
  // Add more seated event titles here
]);

// === CLOUDINARY CONFIG ===
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('CLOUDINARY CONFIG MISSING! Check .env file.');
}

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'event-registrations/screenshots',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, crop: 'limit' }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed!'), false);
  }
});

// === VALIDATORS ===
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidSeatRow = (row) => /^[A-Z]$/.test(row.trim());
const isValidSeatColumn = (col) => {
  const n = parseInt(col);
  return Number.isInteger(n) && n >= 1 && n <= 30;
};

// === ADMIN AUTH MIDDLEWARE (unchanged) ===
const adminAuth = async (req, res, next) => {
  if (req.path === '/login') {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Credentials required' });

    const match = username === process.env.ADMIN_USERNAME &&
                  await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);

    if (match) {
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '2h' });
      return res.json({ message: 'Login successful', token });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// === HELPER: Get Model from Event Title ===
const getModelFromTitle = (title) => {
  const map = {
    'podcast': PodcastRegistration,
    'hackathon': HackathonRegistration,
    'meme war': MemeWarRegistration,
    'memewar': MemeWarRegistration,
    'ideathon': IdeathonRegistration,
    'esports': EsportsRegistration,
    'cultural performance': CulturalPerformanceRegistration,
    'cultural': CulturalPerformanceRegistration,
    'standup': StandupRegistration,
    'stand-up': StandupRegistration,
    'comedy': StandupRegistration,
  };

  const lower = title.toLowerCase();
  for (const key in map) {
    if (lower.includes(key)) return map[key];
  }
  return null; // fallback or throw
};

// === SUBMIT REGISTRATION (Supports All 7 Events + Seats) ===
router.post('/submit', upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Screenshot required' });

    const { title, name, teamName, leaderName, registrationNumber, email, utrId, seatRow, seatColumn } = req.body;

    if (!title?.trim()) {
      await cloudinary.uploader.destroy(req.file.public_id).catch(() => {});
      return res.status(400).json({ error: 'Event title is required' });
    }

    const trimmedTitle = title.trim();
    const isSeated = seatedEvents.has(trimmedTitle);

    // Determine correct model
    const Model = getModelFromTitle(trimmedTitle);
    if (!Model) {
      await cloudinary.uploader.destroy(req.file.public_id).catch(() => {});
      return res.status(400).json({ error: 'Invalid or unsupported event title' });
    }

    // Required fields (dynamic per event)
    const missing = [];
    if (!name && !teamName) missing.push('name or teamName');
    if (!registrationNumber?.trim()) missing.push('registrationNumber');
    if (!email?.trim()) missing.push('email');
    if (!utrId?.trim()) missing.push('utrId');
    if (isSeated && (!seatRow?.trim() || !seatColumn?.trim())) {
      missing.push('seatRow and seatColumn');
    }

    if (missing.length > 0) {
      await cloudinary.uploader.destroy(req.file.public_id).catch(() => {});
      return res.status(400).json({ error: `Missing: ${missing.join(', ')}` });
    }

    if (!isValidEmail(email)) {
      await cloudinary.uploader.destroy(req.file.public_id).catch(() => {});
      return res.status(400).json({ error: 'Invalid email' });
    }

    if (isSeated) {
      if (!isValidSeatRow(seatRow)) {
        await cloudinary.uploader.destroy(req.file.public_id).catch(() => {});
        return res.status(400).json({ error: 'Seat row must be a single letter A-Z' });
      }
      if (!isValidSeatColumn(seatColumn)) {
        await cloudinary.uploader.destroy(req.file.public_id).catch(() => {});
        return res.status(400).json({ error: 'Seat column must be 1–30' });
      }
    }

    // Create registration
    const regData = {
      title: trimmedTitle,
      ...(name && { name: name.trim() }),
      ...(teamName && { teamName: teamName.trim() }),
      ...(leaderName && { leaderName: leaderName.trim() }),
      registrationNumber: registrationNumber.trim(),
      email: email.trim().toLowerCase(),
      utrId: utrId.trim(),
      screenshotUrl: req.file.path,
      public_id: req.file.public_id, // optional: for deletion later
      ...(isSeated && {
        seatRow: seatRow.trim().toUpperCase(),
        seatColumn: parseInt(seatColumn)
      })
    };

    const newReg = new Model(regData);
    await newReg.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: { id: newReg._id, seat: isSeated ? `${seatRow.trim().toUpperCase()}${seatColumn}` : null }
    });

  } catch (error) {
    if (req.file?.public_id) await cloudinary.uploader.destroy(req.file.public_id).catch(() => {});
    console.error('Registration error:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      const msg = field.includes('seat') ? 'This seat is already booked!' :
                  field === 'email' ? 'Email already registered' :
                  field === 'utrId' ? 'UTR ID already used' : `${field} already taken`;
      return res.status(409).json({ error: msg });
    }

    res.status(500).json({ error: 'Server error' });
  }
});

// === GET BOOKED SEATS FOR ANY EVENT ===
router.get('/booked/:title', async (req, res) => {
  try {
    const title = decodeURIComponent(req.params.title).trim();
    const Model = getModelFromTitle(title);

    if (!Model) return res.status(400).json({ error: 'Event not found' });

    const bookings = await Model.find(
      { title, seatRow: { $exists: true }, seatColumn: { $exists: true } },
      { seatRow: 1, seatColumn: 1, name: 1, _id: 0 }
    );

    res.json(bookings.map(b => ({
      row: b.seatRow,
      col: b.seatColumn,
      name: b.name || b.teamName || 'N/A'
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch seats' });
  }
});



module.exports = router;