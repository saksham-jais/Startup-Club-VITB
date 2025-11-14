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
    type: String,        // Optional for non-seated events
    uppercase: true,
    trim: true
  },
  seatColumn: {
    type: Number,        // Optional for non-seated events
    min: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Ensure seat is unique per event (sparse allows docs without seats)
registrationSchema.index({ title: 1, seatRow: 1, seatColumn: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Registration', registrationSchema);