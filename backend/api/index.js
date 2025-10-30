// api/index.js (full, with correct export)
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const serverless = require('serverless-http');  // Ensure installed: npm i serverless-http
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
app.use(express.json({ limit: '10mb' }));  // Handle large payloads (files)

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Routes
app.get('/', (req, res) => res.json({ message: 'Hello from Express on Vercel!' }));
app.use('/registration', registrationRoutes);  // Note: No /api prefix here—add in vercel.json below

// CRITICAL: Export the handler (Vercel invokes this)
module.exports.handler = serverless(app);