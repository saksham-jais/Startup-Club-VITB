// api/index.js (corrected export for Vercel detection)
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const serverless = require('serverless-http');
const registrationRoutes = require('../routes/registration');

const app = express();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection (with global check to avoid reconnects)
if (mongoose.connection.readyState !== 1) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err));
}

// Routes (mount without /api prefix—Vercel adds it)
app.get('/', (req, res) => res.json({ message: 'Hello from Express on Vercel!' }));
app.use('/registration', registrationRoutes);

// CRITICAL: Default export (Vercel auto-detects this as the handler)
module.exports = serverless(app);  // No .handler—default export