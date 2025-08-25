const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  experience: { type: String, required: true },
  skills: [{ type: String }],
  status: { type: String, enum: ['active', 'inactive', 'hired', 'rejected'], default: 'active' },
  appliedDate: { type: String, required: true },
  resume: { type: String },
  coverLetter: { type: String },
  source: { type: String, enum: ['website', 'referral', 'job_board', 'social_media'], default: 'website' },
  notes: String,
  rating: { type: Number, min: 1, max: 5 },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema); 