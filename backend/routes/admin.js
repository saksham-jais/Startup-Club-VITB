// routes/admin.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import StandupRegistration from '../models/StandupRegistration.js';

const router = express.Router();

// ADMIN LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Credentials required' });

  const valid = username === process.env.ADMIN_USERNAME &&
    await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);

  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
  res.json({ message: 'Login successful', token });
});

// GET ALL STANDUP REGISTRATIONS
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const regs = await StandupRegistration.find({}).sort({ createdAt: -1 }).lean();

    const formatted = regs.map(r => ({
      ...r,
      type: 'standup',
      seatDisplay: r.category === 'front' ? 'Front Row' : 'Normal Row',
      offerDisplay: r.offerApplied ? 'Duo ₹998' : 'No Offer',
      memberCount: r.memberCount
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

export default router;