// models/Registration.js
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  utrId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  screenshotUrl: {
    type: String,
    required: true
  },
  seatRow: {
    type: String,        // Changed from Number to String
    required: true,
    uppercase: true,
    trim: true
  },
  seatColumn: {
    type: Number,
    required: true,
    min: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Ensure seat is unique per event
registrationSchema.index({ title: 1, seatRow: 1, seatColumn: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);