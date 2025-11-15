// models/StandupRegistration.js
import mongoose from 'mongoose';

const standupSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  registrationNumber: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  utrId: { type: String, required: true, unique: true, trim: true },
  screenshotUrl: { type: String, required: true },
  seatRow: { type: String, uppercase: true, match: /^[A-Z]$/, sparse: true },
  seatColumn: { type: Number, min: 1, max: 50, sparse: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'standup_registrations' });

// Unique seat per event
standupSchema.index({ title: 1, seatRow: 1, seatColumn: 1 }, { unique: true, sparse: true });
standupSchema.index({ email: 1 });
standupSchema.index({ utrId: 1 });

export default mongoose.model('StandupRegistration', standupSchema);