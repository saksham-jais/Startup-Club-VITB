// routes/admin.js
import express from 'express';
import jwt from 'jsonwebtoken';
import CulturalPerformanceRegistration from '../models/CulturalPerformanceRegistration.js';
import EsportsRegistration from '../models/EsportsRegistration.js';
import HackathonRegistration from '../models/HackathonRegistration.js';
import IdeathonRegistration from '../models/IdeathonRegistration.js';
import MemeWarRegistration from '../models/MemeWarRegistration.js';
import PodcastRegistration from '../models/PodcastRegistration.js';
import StandupRegistration from '../models/StandupRegistration.js';

const router = express.Router();

// Middleware for authentication
const authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret'); // Use env JWT_SECRET
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// GET /admin/all - Fetch all registrations with normalization
router.get('/all', authenticate, async (req, res) => {
  try {
    const [
      culturalRegs,
      esportsRegs,
      hackathonRegs,
      ideathonRegs,
      memewarRegs,
      podcastRegs,
      standupRegs
    ] = await Promise.all([
      CulturalPerformanceRegistration.find({}).lean(),
      EsportsRegistration.find({}).lean(),
      HackathonRegistration.find({}).lean(),
      IdeathonRegistration.find({}).lean(),
      MemeWarRegistration.find({}).lean(),
      PodcastRegistration.find({}).lean(),
      StandupRegistration.find({}).lean()
    ]);

    // Normalize each type to common structure
    const normalizeIndividual = (reg, type) => ({
      ...reg,
      type,
      name: reg.name,
      email: reg.email || null,
      registrationNumber: reg.registrationNumber || null,
      utrId: reg.utrId || null,
      screenshotUrl: reg.screenshotUrl || null,
      seat: reg.seatRow && reg.seatColumn ? `${reg.seatRow}${reg.seatColumn}` : null,
      seatRow: reg.seatRow || null,
      seatColumn: reg.seatColumn || null,
      members: null, // No members
      teamName: null,
      submissionUrl: null,
      memesCount: reg.memes ? reg.memes.length : null
    });

    const normalizeTeam = (reg, type) => {
      const leader = reg.leader;
      return {
        ...reg,
        type,
        name: leader.name,
        email: leader.email,
        registrationNumber: leader.registrationNumber,
        utrId: reg.utrId,
        screenshotUrl: reg.screenshotUrl,
        seat: null, // Teams don't have seats
        seatRow: null,
        seatColumn: null,
        members: reg.members ? reg.members.map(m => `${m.name} (${m.registrationNumber})`).join(', ') : null,
        teamName: reg.teamName,
        submissionUrl: reg.submissionFile ? reg.submissionFile.url : null,
        memesCount: null
      };
    };

    const allRegs = [
      ...culturalRegs.map(r => normalizeIndividual(r, 'cultural')),
      ...podcastRegs.map(r => normalizeIndividual(r, 'podcast')),
      ...esportsRegs.map(r => normalizeIndividual(r, 'esports')),
      ...memewarRegs.map(r => normalizeIndividual(r, 'memewar')),
      ...standupRegs.map(r => normalizeIndividual(r, 'standup')),
      ...hackathonRegs.map(r => normalizeTeam(r, 'hackathon')),
      ...ideathonRegs.map(r => normalizeTeam(r, 'ideathon'))
    ];

    // Sort by createdAt descending
    allRegs.sort((a, b) => new Date(b.createdAt || b.registeredAt) - new Date(a.createdAt || a.registeredAt));

    res.json({ data: allRegs });
  } catch (error) {
    console.error('Error fetching all registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// === ADMIN ROUTES ===
router.post('/login', adminAuth);

export default router;