// models/EsportsRegistration.js
import mongoose from 'mongoose';

const esportsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  registrationNumber: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  utrId: { type: String, required: true, unique: true, trim: true },
  screenshotUrl: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'esports_registrations' });

// Removed: esportsSchema.index({ email: 1 }); esportsSchema.index({ utrId: 1 });  // Duplicates

export default mongoose.model('EsportsRegistration', esportsSchema);