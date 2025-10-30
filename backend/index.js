const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const serverless = require('serverless-http'); // Optional: Keep for Vercel
const registrationRoutes = require('./routes/registration');
require('dotenv').config(); // Fixed: Added .config() to load env vars

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

// Routes
app.get('/', (req, res) => res.json({ message: 'Hello from Express on Render!' })); // Updated message for clarity
app.use('/registration', registrationRoutes);

// For serverless platforms (e.g., Vercel) – export the handler
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  module.exports = serverless(app);
} else {
  // For traditional hosts (e.g., Render, local dev) – start the server
  const port = process.env.PORT || 5000; // Updated default to match your .env
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  module.exports = app; // Still export for potential imports
}