// routes/standup.js — FINAL WITH ALPHANUMERIC UTR SUPPORT
import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import StandupRegistration from '../models/StandupRegistration.js';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'event-registrations/standup', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
});

const upload = multer({ storage });

router.post('/register', upload.single('screenshot'), async (req, res) => {
  try {
    const { title, totalAmount, offerApplied } = req.body;
    const file = req.file;

    if (!title?.trim() || !file) {
      if (file) await cloudinary.uploader.destroy(file.filename).catch(() => {});
      return res.status(400).json({ error: 'Title and screenshot required' });
    }

    const members = [];
    let i = 0;

    while (req.body.members?.[i]?.name) {
      const m = req.body.members[i];
      const member = {
        name: m.name?.trim(),
        registrationNumber: m.registrationNumber?.trim(),
        email: (m.email?.trim() || '').toLowerCase(),
        phone: m.phone?.trim(),
        utrId: m.utrId?.trim(),
        category: m.category || 'normal',
      };

      if (!member.name || !member.email || !member.phone || !member.utrId || !member.registrationNumber) {
        i++;
        continue;
      }

      if (!member.email.endsWith('@vitbhopal.ac.in')) {
        await cloudinary.uploader.destroy(file.filename).catch(() => {});
        return res.status(400).json({ error: 'Only @vitbhopal.ac.in emails allowed' });
      }
      if (!/^\d{10}$/.test(member.phone)) {
        await cloudinary.uploader.destroy(file.filename).catch(() => {});
        return res.status(400).json({ error: 'Phone must be exactly 10 digits' });
      }
      if (member.utrId.length < 12 || !/^[a-zA-Z0-9]+$/.test(member.utrId)) {
        await cloudinary.uploader.destroy(file.filename).catch(() => {});
        return res.status(400).json({ error: 'UTR must be at least 12 characters (letters & numbers only)' });
      }

      members.push(member);
      i++;
    }

    if (members.length === 0) {
      await cloudinary.uploader.destroy(file.filename).catch(() => {});
      return res.status(400).json({ error: 'No valid member data' });
    }
    if (members.length > 2) {
      await cloudinary.uploader.destroy(file.filename).catch(() => {});
      return res.status(400).json({ error: 'Maximum 2 members allowed' });
    }

    const existing = await StandupRegistration.findOne({
      title: title.trim(),
      $or: [
        { email: { $in: members.map(m => m.email) } },
        { utrId: members[0].utrId }
      ]
    });

    if (existing) {
      await cloudinary.uploader.destroy(file.filename).catch(() => {});
      return res.status(409).json({ error: 'Already registered with this email or UTR' });
    }

    await Promise.all(
      members.map(member =>
        new StandupRegistration({
          title: title.trim(),
          name: member.name,
          registrationNumber: member.registrationNumber,
          email: member.email,
          phone: member.phone,
          utrId: member.utrId,
          category: member.category,
          screenshotUrl: file.path,
          screenshotPublicId: file.filename,
          totalAmount: parseInt(totalAmount) || 0,
          memberCount: members.length,
          offerApplied: offerApplied === 'true',
        }).save()
      )
    );

    res.status(201).json({
      success: true,
      message: members.length === 2 && offerApplied === 'true'
        ? 'OFFER APPLIED! 2 Front Row Seats Booked → Only ₹998!'
        : `Successfully registered ${members.length} member(s)!`,
    });

  } catch (error) {
    console.error('Error:', error);
    if (req.file?.filename) await cloudinary.uploader.destroy(req.file.filename).catch(() => {});
    res.status(500).json({ error: 'Server error. Try again.' });
  }
});

export default router;