// server.js — FIXED WITH JSON PARSER (Safe for Multer + JSON routes)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// CORS FIRST
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://startup-club-vitb.vercel.app',
    'https://startup-club-vitbhopal.vercel.app',
    'https://www.startupclubvitb.in'
  ],
  credentials: true,
}));

// ADD JSON PARSER (Needed for login/admin JSON POSTs; Multer overrides for multipart)
app.use(express.json({ limit: '50mb' }));  // Uncommented: Safe with per-route Multer

app.get('/', (req, res) => {
  res.json({ message: 'Startup Club API Running!' });
});

// Routes
import hackathonRoutes from './routes/hackathon.js';
import ideathonRoutes from './routes/ideathon.js';
import memewarRoutes from './routes/memewar.js';
import podcastRoutes from './routes/podcast.js';
import culturalRoutes from './routes/cultural.js';
import esportsRoutes from './routes/esports.js';
import adminRoutes from './routes/admin.js';
import standupRoutes from './routes/standup.js';

app.use('/hackathon', hackathonRoutes);
app.use('/ideathon', ideathonRoutes);
app.use('/memewar', memewarRoutes);
app.use('/podcast', podcastRoutes);
app.use('/cultural', culturalRoutes);
app.use('/esports', esportsRoutes);
app.use('/admin', adminRoutes);
app.use('/standup', standupRoutes); // must be last

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

export default app;