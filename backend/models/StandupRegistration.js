const mongoose = require('mongoose');

const standupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  registrationNumber: {
    type: String,
    unique: true,               // Allows null/undefined → no duplicate check if not provided
    sparse: true                // Important: allows multiple nulls
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
  // Seat fields: OPTIONAL but validated when present
  seatRow: {
    type: String,
    uppercase: true,
    match: /^[A-Z]$/,           // Only allows single letters A–Z
    sparse: true                // Allows multiple docs without this field
  },
  seatColumn: {
    type: Number,
    min: 1,
    max: 50,                    // Adjust based on your venue
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Critical: Unique seat per event title
// This ensures same seat can't be booked twice in the same standup show
standupSchema.index(
  { title: 1, seatRow: 1, seatColumn: 1 },
  { 
    unique: true, 
    sparse: true,               // Allows multiple registrations without seat
    background: true 
  }
);

// Optional: Index for faster email/UTR lookup
standupSchema.index({ email: 1 });
standupSchema.index({ utrId: 1 });

module.exports = mongoose.model('StandupRegistration', standupSchema, 'standup_registrations');