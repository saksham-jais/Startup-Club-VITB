const mongoose = require('mongoose');

const esportsSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Valorant Tournament"
  teamName: { type: String, required: true },
  leaderName: { type: String, required: true },
  registrationNumber: { type: String, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  utrId: { type: String, required: true, unique: true, trim: true },
  screenshotUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('EsportsRegistration', esportsSchema, 'esports_registrations');