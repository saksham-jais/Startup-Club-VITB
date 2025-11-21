// models/StandupRegistration.js
import mongoose from 'mongoose';

const standupSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  registrationNumber: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  utrId: { type: String, required: true, trim: true },
  category: { type: String, enum: ['normal', 'front'], default: 'normal' },
  screenshotUrl: { type: String, required: true },
  screenshotPublicId: { type: String },
  totalAmount: { type: Number, default: 0 },
  memberCount: { type: Number, default: 1 },
  offerApplied: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Prevent same email or UTR from registering twice for same event
standupSchema.index({ title: 1, email: 1 }, { unique: true });
standupSchema.index({ title: 1, utrId: 1 }, { unique: true });

export default mongoose.model('StandupRegistration', standupSchema);