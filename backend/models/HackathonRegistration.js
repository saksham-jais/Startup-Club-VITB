import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  registrationNumber: { type: String, required: true, trim: true }
});

const hackathonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  teamName: { type: String, required: true, trim: true },
  leader: {
    name: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true }
  },
  members: {
    type: [memberSchema],
    validate: [arr => arr.length <= 5, 'Max 5 additional members']
  },
  utrId: { type: String, required: true, unique: true, trim: true },
  screenshotUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'hackathon_registrations' });

hackathonSchema.index({ "leader.registrationNumber": 1 });
hackathonSchema.index({ "members.registrationNumber": 1 });
// Removed: hackathonSchema.index({ utrId: 1 });  // Duplicate

export default mongoose.model('HackathonRegistration', hackathonSchema);