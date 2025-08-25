const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  variables: [String], // e.g., ['candidateName', 'jobTitle', 'companyName']
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema); 