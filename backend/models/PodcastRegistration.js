import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: { type: String, required: true, trim: true },
  registeredAt: { type: Date, default: Date.now }
}, { collection: 'podcast_registrations' });

export default mongoose.model('PodcastRegistration', schema);