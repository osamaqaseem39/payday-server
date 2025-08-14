const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/payday-dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schemas
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
  applicationsCount: { type: Number, default: 0 }
}, { timestamps: true });

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  experience: { type: String, required: true },
  skills: [{ type: String }],
  status: { type: String, enum: ['active', 'inactive', 'hired'], default: 'active' },
  appliedDate: { type: String, required: true }
}, { timestamps: true });

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' },
  appliedDate: { type: String, required: true },
  resume: { type: String, required: true },
  coverLetter: { type: String, required: true },
  experience: { type: String, required: true }
}, { timestamps: true });

const interviewSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  date: { type: String, required: true },
  type: { type: String, enum: ['technical', 'behavioral', 'final'], required: true },
  interviewer: { type: String, required: true },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  notes: { type: String }
}, { timestamps: true });

// Create Models
const Job = mongoose.model('Job', jobSchema);
const Candidate = mongoose.model('Candidate', candidateSchema);
const Application = mongoose.model('Application', applicationSchema);
const Interview = mongoose.model('Interview', interviewSchema);

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    await Job.deleteMany({});
    await Candidate.deleteMany({});
    await Application.deleteMany({});
    await Interview.deleteMany({});

    // Create jobs
    const jobs = await Job.insertMany([
      {
        title: "Senior Frontend Developer",
        department: "Engineering",
        location: "Remote",
        type: "full-time",
        experience: "5+ years",
        salary: "$80,000 - $120,000",
        description: "We're looking for an experienced frontend developer to join our team and help build amazing user experiences.",
        deadline: "2024-12-31",
        status: "active",
        postedDate: "2024-01-15",
        applicationsCount: 12
      },
      {
        title: "UX Designer",
        department: "Design",
        location: "New York",
        type: "full-time",
        experience: "3+ years",
        salary: "$70,000 - $100,000",
        description: "Join our design team to create intuitive and beautiful user interfaces for our products.",
        deadline: "2024-11-30",
        status: "active",
        postedDate: "2024-01-10",
        applicationsCount: 8
      },
      {
        title: "Product Manager",
        department: "Product",
        location: "San Francisco",
        type: "full-time",
        experience: "4+ years",
        salary: "$90,000 - $130,000",
        description: "Lead product strategy and work with cross-functional teams to deliver exceptional products.",
        deadline: "2024-10-15",
        status: "closed",
        postedDate: "2024-01-05",
        applicationsCount: 15
      }
    ]);

    // Create candidates
    const candidates = await Candidate.insertMany([
      {
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+1-555-0123",
        experience: "6 years",
        skills: ["React", "TypeScript", "Node.js"],
        status: "active",
        appliedDate: "2024-01-20"
      },
      {
        name: "Jane Smith",
        email: "jane.smith@email.com",
        phone: "+1-555-0124",
        experience: "4 years",
        skills: ["Vue.js", "JavaScript", "CSS"],
        status: "active",
        appliedDate: "2024-01-18"
      }
    ]);

    // Create applications
    await Application.insertMany([
      {
        jobId: jobs[0]._id,
        candidateId: candidates[0]._id,
        status: "pending",
        appliedDate: "2024-01-20",
        resume: "resume1.pdf",
        coverLetter: "I'm excited to apply for this position...",
        experience: "6 years in React development"
      },
      {
        jobId: jobs[0]._id,
        candidateId: candidates[1]._id,
        status: "reviewed",
        appliedDate: "2024-01-18",
        resume: "resume2.pdf",
        coverLetter: "With my background in frontend...",
        experience: "4 years in web development"
      }
    ]);

    // Create interviews
    await Interview.insertMany([
      {
        candidateId: candidates[0]._id,
        jobId: jobs[0]._id,
        date: "2024-02-01T10:00:00Z",
        type: "technical",
        interviewer: "Sarah Johnson",
        status: "scheduled",
        notes: "Focus on React and system design"
      },
      {
        candidateId: candidates[1]._id,
        jobId: jobs[0]._id,
        date: "2024-02-02T14:00:00Z",
        type: "behavioral",
        interviewer: "Mike Chen",
        status: "scheduled",
        notes: "Discuss team collaboration experience"
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedData(); 