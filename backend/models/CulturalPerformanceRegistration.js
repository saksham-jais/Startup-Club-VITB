import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  registrationNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
  email: { type: String, required: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/] },
  registeredAt: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'culturalperformance_registrations' });

export default mongoose.model('CulturalPerformanceRegistration', schema);