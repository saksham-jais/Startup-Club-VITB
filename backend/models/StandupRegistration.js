// models/StandupRegistration.js — GROUP VERSION (Single Doc with Members Array)
import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  registrationNumber: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  category: { type: String, enum: ['normal', 'front'], default: 'normal' },
});

// Main schema: One doc per registration (1-2 members)
const standupSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  members: [memberSchema],  // Array of 1-2 members
  utrId: { type: String, required: true, trim: true },  // Shared UTR for group
  screenshotUrl: { type: String, required: true },
  screenshotPublicId: { type: String },
  totalAmount: { type: Number, default: 0 },
  memberCount: { type: Number, required: true, min: 1, max: 2 },
  offerApplied: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes
// Unique per group (title + UTR) — prevents re-reg with same payment
standupSchema.index({ title: 1, utrId: 1 }, { unique: true });

// Optional: Unique per person (no one joins twice, even in different groups)
standupSchema.index({ title: 1, 'members.email': 1 }, { unique: true });

export default mongoose.model('StandupRegistration', standupSchema);