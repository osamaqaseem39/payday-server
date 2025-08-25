const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  status: { type: String, enum: ['pending', 'reviewed', 'shortlisted', 'interviewed', 'accepted', 'rejected'], default: 'pending' },
  appliedDate: { type: String, required: true },
  resume: { type: String, required: true },
  coverLetter: { type: String, required: true },
  experience: { type: String, required: true },
  screeningScore: { type: Number, min: 0, max: 100 },
  notes: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewDate: Date,
  rejectionReason: String
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema); 