// api/index.js (updated for Vercel serverless)
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// Remove these logs after fixing
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const serverless = require('serverless-http');  // NEW: Install & require this
const registrationRoutes = require('../routes/registration');  // Adjust path if needed

const app = express();
const PORT = process.env.PORT || 5000;  // PORT is set by Vercel, but unused here

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (connects on each invocation; use connection pooling if high traffic)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express on Vercel!' });
});

app.use('/api/registration', registrationRoutes);

// NEW: Export as serverless handler (Vercel calls this automatically)
module.exports.handler = serverless(app);  // Wraps your app for serverless runtime

// For local dev only (comment out or remove for prod):
// if (require.main === module) {
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }