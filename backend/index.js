// server.js - Updated for Render compatibility
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
// import serverless from 'serverless-http';  // Commented out for Render; re-enable for Lambda

// Import routes at top (ESM requirement)
import hackathonRoutes from './routes/hackathon.js';
import ideathonRoutes from './routes/ideathon.js';
import memewarRoutes from './routes/memewar.js';
import podcastRoutes from './routes/podcast.js';
import culturalRoutes from './routes/cultural.js';
import esportsRoutes from './routes/esports.js';
import standupRoutes from './routes/standup.js';
import adminRoutes from './routes/admin.js';

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://startup-club-vitb.vercel.app',
    'https://startup-club-vitbhopal.vercel.app',
    'https://www.startupclubvitb.in'
  ],
  credentials: true,
}));

app.get('/', (req, res) => {
  res.json({ message: 'Startup Club API Running!' });
});

app.use('/hackathon', hackathonRoutes);
app.use('/ideathon', ideathonRoutes);
app.use('/memewar', memewarRoutes);
app.use('/podcast', podcastRoutes);
app.use('/cultural', culturalRoutes);
app.use('/esports', esportsRoutes);
app.use('/standup', standupRoutes);
app.use('/admin', adminRoutes);

// Connect to MongoDB (use top-level await or wrap in async IIFE)
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }

  // Always bind to PORT for Render/Vercel/local
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

// For Lambda (if needed later):
// const handler = serverless(app);
// export { handler };
export default app;