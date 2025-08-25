const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  date: { type: String, required: true },
  type: { type: String, enum: ['technical', 'behavioral', 'final', 'phone_screen'], required: true },
  interviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'], default: 'scheduled' },
  notes: String,
  score: { type: Number, min: 1, max: 10 },
  feedback: String,
  nextRound: { type: String, enum: ['yes', 'no', 'maybe'] },
  duration: Number, // in minutes
  location: String,
  meetingLink: String
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema); 