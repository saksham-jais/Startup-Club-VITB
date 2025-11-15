// routes/standup.js
import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import StandupRegistration from '../models/StandupRegistration.js';
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
    folder: 'event-registrations/standup',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});

const upload = multer({ storage });

const router = express.Router();

// GET: Fetch all booked seats for a specific standup event
router.get('/booked/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const registrations = await StandupRegistration.find(
      { title: decodeURIComponent(title), seatRow: { $exists: true } },
      'seatRow seatColumn'
    );
    res.json(registrations.map(r => ({ row: r.seatRow, col: r.seatColumn })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load seats' });
  }
});

// POST: Submit registration
router.post('/register', upload.single('screenshot'), async (req, res) => {
  try {
    const { title, name, registrationNumber, email, utrId, seatRow, seatColumn } = req.body;
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

    // Only add seat if provided
    if (seatRow && seatColumn) {
      data.seatRow = seatRow.toUpperCase();
      data.seatColumn = parseInt(seatColumn);
    }

    const registration = new StandupRegistration(data);
    await registration.save();

    res.status(201).json({
      success: true,
      message: 'Stand-Up Registration Successful!',
      seat: seatRow && seatColumn ? `${seatRow}${seatColumn}` : 'General'
    });

  } catch (error) {
    if (req.file?.public_id) {
      cloudinary.uploader.destroy(req.file.public_id).catch(() => {});
    }
    console.error('Standup registration error:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const msg = field === 'email' ? 'Email already registered' :
                  field === 'utrId' ? 'UTR ID already used' :
                  'This seat is already booked!';
      return res.status(409).json({ error: msg });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;