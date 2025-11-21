// routes/standup.js
import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import StandupRegistration from '../models/StandupRegistration.js';

const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'event-registrations/standup',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({ storage });

// routes/standup.js — FINAL BULLETPROOF VERSION
router.post('/register', upload.fields([{ name: 'screenshot', maxCount: 1 }]), async (req, res) => {
  try {
    const file = req.files?.screenshot?.[0];
    const body = req.body;

    console.log('BODY KEYS:', Object.keys(body));
    console.log('OFFER APPLIED:', body.offerApplied);

    if (!file) return res.status(400).json({ error: 'Payment screenshot required' });

    const members = [];

    // Dynamically detect how many members were sent
    let i = 0;
    while (true) {
      const name = body[`member_name_${i}`];
      if (!name) break; // No more members

      const regNo = body[`member_regNo_${i}`];
      const email = body[`member_email_${i}`];
      const phone = body[`member_phone_${i}`];
      const utrId = body[`member_utrId_${i}`];
      const category = body[`member_category_${i}`] || 'normal';

      // Validate each member
      if (!name || !regNo || !email || !phone || !utrId) {
        await cloudinary.uploader.destroy(file.filename);
        return res.status(400).json({ error: 'All fields required for member ' + (i + 1) });
      }

      if (!email.endsWith('@vitbhopal.ac.in')) {
        await cloudinary.uploader.destroy(file.filename);
        return res.status(400).json({ error: 'Only @vitbhopal.ac.in emails allowed' });
      }

      if (!/^\d{10}$/.test(phone)) {
        await cloudinary.uploader.destroy(file.filename);
        return res.status(400).json({ error: 'Phone must be exactly 10 digits' });
      }

      if (utrId.length < 12 || !/^[a-zA-Z0-9]+$/.test(utrId)) {
        await cloudinary.uploader.destroy(file.filename);
        return res.status(400).json({ error: 'UTR must be 12+ alphanumeric characters' });
      }

      members.push({ name, regNo, email: email.toLowerCase(), phone, utrId, category });
      i++;
    }

    if (members.length === 0) {
      await cloudinary.uploader.destroy(file.filename);
      return res.status(400).json({ error: 'No member data received' });
    }

    // Duplicate check
    const existing = await StandupRegistration.findOne({
      title: body.title?.trim(),
      $or: [
        { email: { $in: members.map(m => m.email) } },
        { utrId: { $in: members.map(m => m.utrId) } }
      ]
    });

    if (existing) {
      await cloudinary.uploader.destroy(file.filename);
      return res.status(409).json({ error: 'Already registered with this email or UTR' });
    }

    // Save all members
    const registrations = members.map(member => new StandupRegistration({
      title: body.title?.trim(),
      name: member.name,
      registrationNumber: member.regNo,
      email: member.email,
      phone: member.phone,
      utrId: member.utrId,
      category: member.category,
      screenshotUrl: file.path,
      screenshotPublicId: file.filename,
      totalAmount: parseInt(body.totalAmount) || 0,
      memberCount: members.length,
      offerApplied: body.offerApplied === 'true',
    }));

    await Promise.all(registrations.map(r => r.save()));

    res.status(201).json({
      success: true,
      message: body.offerApplied === 'true'
        ? 'OFFER APPLIED! 2 Front Row Seats → Only ₹998!'
        : 'Registration successful!'
    });

  } catch (err) {
    console.error('Standup Registration Error:', err);
    // Only delete if file exists and wasn't already deleted
    if (req.files?.screenshot?.[0]?.filename) {
      await cloudinary.uploader.destroy(req.files.screenshot[0].filename).catch(() => {});
    }
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

export default router;