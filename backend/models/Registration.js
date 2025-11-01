// models/Registration.js
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  registrationNumber: {
    type: String,
    unique: true // Assuming registration numbers are unique
  },
  email: {
    type: String,
    required: true,
    unique: true // Emails should be unique
  },
  utrId: {
    type: String,
    required: true,
    unique: true 
  },
  screenshotUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);