import express from 'express';
import PodcastRegistration from '../models/PodcastRegistration.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { title, name, registrationNumber, email, phone } = req.body;

    if (!title || !name || !registrationNumber || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = await PodcastRegistration.findOne({
      $or: [{ registrationNumber: registrationNumber.trim().toUpperCase() }, { email: email.trim().toLowerCase() }]
    });

    if (existing) {
      return res.status(409).json({ error: 'Already registered' });
    }

    const reg = new PodcastRegistration({
      title: title.trim(),
      name: name.trim(),
      registrationNumber: registrationNumber.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim()
    });

    await reg.save();

    res.status(201).json({ success: true, message: 'Podcast registration successful!' });
  } catch (error) {
    console.error('Podcast error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;