import mongoose from 'mongoose';

const memeSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  format: { type: String, enum: ['jpg', 'jpeg', 'png', 'webp', 'gif'], required: true }
}, { _id: false });

const memeWarSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  registrationNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/] },
  utrId: { type: String, required: true, unique: true, trim: true },
  screenshotUrl: { type: String, required: true },
  screenshotPublicId: String,
  memes: {
    type: [memeSchema],
    required: true,
    validate: [arr => arr.length >= 1 && arr.length <= 3, '1–3 memes required']
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'memewar_registrations' });

memeWarSchema.index({ registrationNumber: 1 }, { unique: true });
memeWarSchema.index({ email: 1 }, { unique: true });
memeWarSchema.index({ utrId: 1 }, { unique: true });

export default mongoose.model('MemeWarRegistration', memeWarSchema);