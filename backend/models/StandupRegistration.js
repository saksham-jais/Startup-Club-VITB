// models/StandupRegistration.js
import mongoose from 'mongoose';

const standupSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  registrationNumber: { type: String, sparse: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  utrId: { type: String, required: true, trim: true },
  category: { type: String, enum: ['normal', 'front'], default: 'normal' },
  screenshotUrl: { type: String, required: true },
  screenshotPublicId: { type: String }, // For deletion
  totalAmount: { type: Number },
  memberCount: { type: Number, default: 1 },
  offerApplied: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound unique indexes
standupSchema.index({ title: 1, email: 1 }, { unique: true });        // One email per event
standupSchema.index({ title: 1, utrId: 1 }, { unique: true });         // One UTR per event (shared)

export default mongoose.model('StandupRegistration', standupSchema);