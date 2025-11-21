// routes/standup.js — FIXED UTR EXTRACTION (Sets sharedUtrId from body[0])
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import StandupRegistration from '../models/StandupRegistration.js';

const router = express.Router();

// Multer: Buffer file in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'), false);
  },
});

router.post('/register', upload.single('screenshot'), async (req, res) => {
  let screenshotUrl = null;
  let screenshotPublicId = null;
  try {
    const body = req.body;
    console.log('BODY KEYS:', Object.keys(body));
    console.log('OFFER APPLIED:', body.offerApplied);
    console.log('FILE BUFFER SIZE (bytes):', req.file?.buffer?.length || 0);

    if (!req.file) {
      return res.status(400).json({ error: 'Payment screenshot required (image only, <5MB)' });
    }

    const members = [];
    let i = 0;
    while (true) {
      const name = body[`member_name_${i}`];
      if (!name) break;
      const regNo = body[`member_regNo_${i}`];
      const email = body[`member_email_${i}`];
      const phone = body[`member_phone_${i}`];
      const utrId = body[`member_utrId_${i}`];
      const category = body[`member_category_${i}`] || 'normal';

      if (!name || !regNo || !email || !phone || !utrId) {
        return res.status(400).json({ error: 'All fields required for member ' + (i + 1) });
      }
      if (!email.endsWith('@vitbhopal.ac.in')) {
        return res.status(400).json({ error: 'Only @vitbhopal.ac.in emails allowed' });
      }
      if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ error: 'Phone must be exactly 10 digits' });
      }
      if (utrId.length < 12 || !/^[a-zA-Z0-9]+$/.test(utrId)) {
        return res.status(400).json({ error: 'UTR must be 12+ alphanumeric characters' });
      }

      members.push({ name, registrationNumber: regNo, email: email.toLowerCase(), phone, category });
      i++;
    }

    if (members.length === 0 || members.length > 2) {
      return res.status(400).json({ error: '1-2 members required' });
    }

    // Extract shared UTR (from first member — all should match)
    const sharedUtrId = body[`member_utrId_0`];
    if (!sharedUtrId) {
      return res.status(400).json({ error: 'Shared UTR ID required' });
    }

    // Optional: Validate all UTRs match (frontend copies, but enforce)
    for (let j = 1; j < members.length; j++) {
      const thisUtr = body[`member_utrId_${j}`];
      if (thisUtr !== sharedUtrId) {
        return res.status(400).json({ error: 'All members must use the same UTR ID' });
      }
    }

    // Upload to Cloudinary (AFTER validation)
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        const { upload_stream } = cloudinary.uploader;
        const stream = upload_stream(
          {
            folder: 'event-registrations/standup',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      screenshotUrl = uploadResult.secure_url;
      screenshotPublicId = uploadResult.public_id;
      console.log('UPLOAD SUCCESS: Public ID', screenshotPublicId);
    } catch (uploadErr) {
      console.error('Cloudinary upload error:', uploadErr);
      return res.status(400).json({ error: 'Upload failed—ensure JPG/PNG <5MB and try again' });
    }

    // Duplicate check: By shared UTR or any email (per event)
    const existing = await StandupRegistration.findOne({
      title: body.title?.trim(),
      $or: [
        { utrId: sharedUtrId },
        { 'members.email': { $in: members.map(m => m.email) } }
      ]
    });
    if (existing) {
      await cloudinary.uploader.destroy(screenshotPublicId).catch(console.error);
      return res.status(409).json({ error: 'Already registered with this email or UTR' });
    }

    // PREPARE single registration doc
    const registration = new StandupRegistration({
      title: body.title?.trim(),
      members,  // Array of members
      utrId: sharedUtrId,
      screenshotUrl,
      screenshotPublicId,
      totalAmount: parseInt(body.totalAmount) || 0,
      memberCount: members.length,
      offerApplied: body.offerApplied === 'true',
    });

    console.log('GROUP REG DATA:', {
      title: registration.title,
      memberCount: registration.memberCount,
      utrId: registration.utrId,
      members: registration.members.map(m => ({ name: m.name, email: m.email })),
    });

    // SAVE single doc
    const savedReg = await registration.save();
    console.log(`SAVED GROUP: ${members.length} members, ID:`, savedReg._id);

    res.status(201).json({
      success: true,
      message: body.offerApplied === 'true'
        ? 'OFFER APPLIED! 2 Front Row Seats → Only ₹998!'
        : 'Registration successful!'
    });

  } catch (err) {
    console.error('Standup Registration Error:', err);
    if (screenshotPublicId) {
      await cloudinary.uploader.destroy(screenshotPublicId).catch(console.error);
    }
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

export default router;