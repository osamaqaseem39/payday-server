const Job = require('../models/Job');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

// Get all jobs with filters
const getJobs = async (req, res) => {
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
    console.error('Jobs API error:', error);
    res.status(500).json({ message: 'Internal server error. Please try again.' });
  }
};

// Create new job
const createJob = async (req, res) => {
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
};

// Get job by ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update job
const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete job
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob
}; 