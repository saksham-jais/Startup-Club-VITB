const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const serverless = require('serverless-http');
const registrationRoutes = require('./routes/registration');
require('dotenv').config();

const app = express();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://startup-club-vitb.vercel.app','https://startup-club-vitbhopal.vercel.app'], // Update with your frontend domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // If cookies or credentials are needed
}));

// Middleware
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
if (mongoose.connection.readyState !== 1) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err));
}

// Routes
app.get('/', (req, res) => res.json({ message: 'Hello from Express on Render!' }));
app.use('/registration', registrationRoutes);

// For serverless platforms (e.g., Vercel)
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  module.exports = serverless(app);
} else {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  module.exports = app;
}