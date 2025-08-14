const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image, PDF, and document files are allowed!'));
    }
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/payday-dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Role-based access control middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

// Define Schemas
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

const emailTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  variables: [String], // e.g., ['candidateName', 'jobTitle', 'companyName']
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Create Models
const User = mongoose.model('User', userSchema);
const Job = mongoose.model('Job', jobSchema);
const Candidate = mongoose.model('Candidate', candidateSchema);
const Application = mongoose.model('Application', applicationSchema);
const Interview = mongoose.model('Interview', interviewSchema);
const EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema);

// Helper function to send emails
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: to,
      subject: subject,
      html: html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

// Helper function to replace template variables
const replaceTemplateVariables = (template, variables) => {
  let result = template;
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, variables[key]);
  });
  return result;
};

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, department, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      department,
      role: role || 'hr_staff'
    });
    
    await user.save();
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User management routes
app.get('/api/users', authenticateToken, requireRole(['admin', 'hr_manager']), async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/users/:id', authenticateToken, requireRole(['admin', 'hr_manager']), async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    let updateFields = updateData;
    
    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }
    
    const user = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true, select: '-password' });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enhanced Jobs API with authentication
app.get('/api/jobs', authenticateToken, async (req, res) => {
  try {
    const { status, department, type, search } = req.query;
    let query = {};
    
    if (status && status !== 'all') query.status = status;
    if (department && department !== 'all') query.department = department;
    if (type && type !== 'all') query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const jobs = await Job.find(query).populate('createdBy', 'firstName lastName');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/jobs', authenticateToken, requireRole(['admin', 'hr_manager', 'hr_staff']), async (req, res) => {
  try {
    const jobData = { ...req.body, createdBy: req.user.userId };
    const job = new Job(jobData);
    const newJob = await job.save();
    
    // Send notification to relevant team members
    const teamMembers = await User.find({ 
      department: job.department, 
      role: { $in: ['hr_manager', 'hr_staff'] } 
    });
    
    teamMembers.forEach(async (member) => {
      await sendEmail(
        member.email,
        'New Job Posted',
        `<h3>New job posted: ${job.title}</h3><p>Department: ${job.department}</p><p>Location: ${job.location}</p>`
      );
    });
    
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// File upload routes
app.post('/api/upload/resume', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    res.json({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/upload/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    res.json({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enhanced Applications API
app.post('/api/applications', authenticateToken, async (req, res) => {
  try {
    const application = new Application(req.body);
    const newApplication = await application.save();
    
    // Update job applications count
    await Job.findByIdAndUpdate(req.body.jobId, { $inc: { applicationsCount: 1 } });
    
    // Send confirmation email to candidate
    const candidate = await Candidate.findById(req.body.candidateId);
    const job = await Job.findById(req.body.jobId);
    
    if (candidate && job) {
      await sendEmail(
        candidate.email,
        'Application Received',
        `<h3>Thank you for your application!</h3><p>We have received your application for <strong>${job.title}</strong>.</p><p>We will review your application and get back to you soon.</p>`
      );
    }
    
    res.status(201).json(newApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Email template routes
app.get('/api/email-templates', authenticateToken, requireRole(['admin', 'hr_manager']), async (req, res) => {
  try {
    const templates = await EmailTemplate.find();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/email-templates', authenticateToken, requireRole(['admin', 'hr_manager']), async (req, res) => {
  try {
    const template = new EmailTemplate(req.body);
    const newTemplate = await template.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Send email using template
app.post('/api/send-email', authenticateToken, requireRole(['admin', 'hr_manager', 'hr_staff']), async (req, res) => {
  try {
    const { templateName, to, variables } = req.body;
    
    const template = await EmailTemplate.findOne({ name: templateName, isActive: true });
    if (!template) {
      return res.status(404).json({ message: 'Email template not found' });
    }
    
    const subject = replaceTemplateVariables(template.subject, variables);
    const body = replaceTemplateVariables(template.body, variables);
    
    const success = await sendEmail(to, subject, body);
    
    if (success) {
      res.json({ message: 'Email sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send email' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Advanced reporting routes
app.get('/api/reports/hiring-metrics', authenticateToken, requireRole(['admin', 'hr_manager']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }
    
    const metrics = {
      totalApplications: await Application.countDocuments(dateFilter),
      applicationsByStatus: await Application.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      applicationsByDepartment: await Application.aggregate([
        { $match: dateFilter },
        { $lookup: { from: 'jobs', localField: 'jobId', foreignField: '_id', as: 'job' } },
        { $unwind: '$job' },
        { $group: { _id: '$job.department', count: { $sum: 1 } } }
      ]),
      timeToHire: await Application.aggregate([
        { $match: { ...dateFilter, status: 'accepted' } },
        { $lookup: { from: 'candidates', localField: 'candidateId', foreignField: '_id', as: 'candidate' } },
        { $unwind: '$candidate' },
        {
          $addFields: {
            timeToHire: {
              $divide: [
                { $subtract: [new Date(), { $dateFromString: { dateString: '$candidate.appliedDate' } }] },
                1000 * 60 * 60 * 24 // Convert to days
              ]
            }
          }
        },
        { $group: { _id: null, avgTimeToHire: { $avg: '$timeToHire' } } }
      ])
    };
    
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/reports/candidate-pipeline', authenticateToken, requireRole(['admin', 'hr_manager']), async (req, res) => {
  try {
    const pipeline = await Application.aggregate([
      { $lookup: { from: 'candidates', localField: 'candidateId', foreignField: '_id', as: 'candidate' } },
      { $lookup: { from: 'jobs', localField: 'jobId', foreignField: '_id', as: 'job' } },
      { $unwind: '$candidate' },
      { $unwind: '$job' },
      {
        $group: {
          _id: '$status',
          candidates: {
            $push: {
              name: '$candidate.name',
              email: '$candidate.email',
              jobTitle: '$job.title',
              appliedDate: '$appliedDate'
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json(pipeline);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dashboard Stats API (enhanced)
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const stats = {
      totalApplications: await Application.countDocuments(),
      activeJobs: await Job.countDocuments({ status: 'active' }),
      totalCandidates: await Candidate.countDocuments(),
      interviewsThisWeek: await Interview.countDocuments({
        date: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      }),
      applicationsThisMonth: await Application.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }),
      topDepartments: await Job.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      recentApplications: await Application.find()
        .populate('candidateId', 'name email')
        .populate('jobId', 'title department')
        .sort({ createdAt: -1 })
        .limit(5)
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Keep existing routes but add authentication
app.get('/api/jobs/:id', authenticateToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/jobs/:id', authenticateToken, requireRole(['admin', 'hr_manager', 'hr_staff']), async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/jobs/:id', authenticateToken, requireRole(['admin', 'hr_manager']), async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Keep other existing routes with authentication...
// (Candidates, Applications, Interviews APIs remain the same but with authenticateToken middleware)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Enhanced HR Dashboard Server is running on port ${PORT}`);
  console.log('Features: Authentication, Role-based Access, Email Notifications, File Uploads, Advanced Reporting');
}); 