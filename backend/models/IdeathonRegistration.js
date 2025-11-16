import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  registrationNumber: { type: String, required: true, trim: true }
}, { _id: false });

const ideathonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  teamName: { type: String, required: true, trim: true },
  leader: {
    name: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Valid email required'] },
    phone: { type: String, trim: true }
  },
  members: {
    type: [memberSchema],
    validate: [arr => arr.length <= 5, 'Max 5 additional members'],
    default: []
  },
  utrId: { type: String, required: true, unique: true, trim: true },
  screenshotUrl: { type: String, required: true },
  submissionFile: {
    url: { type: String, required: true },
    public_id: String,
    format: { type: String, enum: ['pdf', 'pptx', 'ppt'], required: true }
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'ideathon_registrations' });

ideathonSchema.index({ "leader.registrationNumber": 1 });
ideathonSchema.index({ "members.registrationNumber": 1 });
// Removed: ideathonSchema.index({ utrId: 1 }, { unique: true });  // Duplicate

export default mongoose.model('IdeathonRegistration', ideathonSchema);