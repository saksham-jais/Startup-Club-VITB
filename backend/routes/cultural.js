// routes/cultural.js  ← 100% ESM, works with your index.js

import express from 'express';
import CulturalPerformanceRegistration from '../models/CulturalPerformanceRegistration.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { title, name, registrationNumber, email, phone } = req.body;

    if (!title?.trim() || !name?.trim() || !registrationNumber?.trim() || !email?.trim()) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const normalizedRegNo = registrationNumber.trim().toUpperCase();

    const existing = await CulturalPerformanceRegistration.findOne({
      $or: [
        { registrationNumber: normalizedRegNo },
        { email: email.trim().toLowerCase() }
      ]
    });

    if (existing) {
      const field = existing.registrationNumber === normalizedRegNo 
        ? 'Registration number' : 'Email';
      return res.status(409).json({ error: `${field} already registered` });
    }

    const registration = new CulturalPerformanceRegistration({
      title: title.trim(),
      name: name.trim(),
      registrationNumber: normalizedRegNo,
      email: email.trim().toLowerCase(),
      phone: phone?.trim()
    });

    await registration.save();

    res.status(201).json({
      success: true,
      message: 'Successfully registered for Cultural Performance!',
      participant: name.trim()
    });

  } catch (error) {
    console.error('Cultural registration error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'You are already registered' });
    }
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// THIS LINE IS CRITICAL
export default router;