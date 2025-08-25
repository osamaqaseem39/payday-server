const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], required: true },
  experience: { type: String, required: true },
  salary: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: String, required: true },
  status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
  postedDate: { type: String, required: true },
  applicationsCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  requirements: [String],
  benefits: [String],
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema); 