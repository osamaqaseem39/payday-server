const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'hr_manager', 'hr_staff', 'interviewer'], default: 'hr_staff' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  department: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  permissions: [{
    resource: String,
    actions: [String] // ['create', 'read', 'update', 'delete']
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 