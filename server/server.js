import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';

// NEW: Allow CORS from your Vercel frontend
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://job-platform-rose.vercel.app', // Replace with your actual Vercel URL
  'https://your-job-platform-git-main.vercel.app' // Preview deployments
];

import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB (CHANGE THIS if using Atlas!)
const MONGO = process.env.MONGODB_URI;
// If using Atlas, replace above line with your connection string like:
// const MONGO = 'mongodb+srv://youruser:yourpassword@cluster.mongodb.net/jobapp';

if (!MONGO) {
  console.error('Error: MONGODB_URI not set. Please set MONGODB_URI in .env or environment variables.');
  process.exit(1);
}

try {
  await mongoose.connect(MONGO);
  console.log('MongoDB connected!');
} catch (err) {
  console.error('MongoDB connection failed:', err.message);
  console.error('Suggestions:');
  console.error('- Verify the connection string in server/.env');
  console.error('- Ensure your IP is whitelisted in MongoDB Atlas (Network Access)');
  console.error('- Run: nslookup -type=SRV _mongodb._tcp.<your-cluster-hostname>');
  process.exit(1);
}

// Job Model (schema/structure of a job in database)
const Job = mongoose.model('Job', new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'], default: 'full-time' },
  skills: [String],
  description: { type: String, required: true },
  requirements: String,
  salary: String,
  experience: { type: String, enum: ['entry-level', 'mid-level', 'senior', 'executive'], default: 'entry-level' },
  benefits: String,
  remote: { type: Boolean, default: false },
  urgent: { type: Boolean, default: false },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true }));

// User Model
const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['jobseeker', 'employer'], default: 'jobseeker' }
}, { timestamps: true }));

// Application Model
const Application = mongoose.model('Application', new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: { type: String, required: true }, // file path
  coverLetter: String,
  status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true }));

// Bookmark Model
const Bookmark = mongoose.model('Bookmark', new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true }));

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Create Express app
const app = express();
app.use(cors({
  origin: function(origin, callback) {
    console.log('CORS origin:', origin);
    // Allow when no origin (server-to-server / same-origin requests), or exact match in allow list
    if (!origin || ALLOWED_ORIGINS.includes(origin) || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      callback(null, true);
      return;
    }

    // During development be forgiving and allow other local dev hosts
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Allowing CORS origin in development:', origin);
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  }
}));

app.use(express.json()); // Parse JSON from requests

// API Route 1: GET all jobs (with optional filters, pagination and sorting)
app.get('/api/jobs', async (req, res) => {
  const { q = '', location = '', type = '', page = 1, limit = 10, sort = 'newest' } = req.query;
  
  const filter = {};
  if (q) filter.title = new RegExp(q, 'i'); // Search in title
  if (location) filter.location = new RegExp(location, 'i');
  if (type) filter.type = type;

  const sortOption = (sort === 'oldest') ? { createdAt: 1 } : { createdAt: -1 };

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const perPage = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));

  const total = await Job.countDocuments(filter);
  const jobs = await Job.find(filter)
    .sort(sortOption)
    .skip((pageNum - 1) * perPage)
    .limit(perPage);

  res.json({ jobs, totalPages: Math.ceil(total / perPage), currentPage: pageNum, total });
});

// API Route 2: POST create a new job
app.post('/api/jobs', async (req, res) => {
  const data = req.body;
  
  // If skills is a string like "react,node,mongodb", split it into array
  if (typeof data.skills === 'string') {
    data.skills = data.skills.split(',').map(s => s.trim()).filter(Boolean);
  }
  
  const job = await Job.create(data);
  res.status(201).json(job);
});

// Auth Routes
// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get current user
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Job Routes
// Get all jobs with filtering and pagination
app.get('/api/jobs', async (req, res) => {
  try {
    const { q, location, type, page = 1, limit = 10, sort = 'newest' } = req.query;
    const query = {};

    if (q) query.title = { $regex: q, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      title: { title: 1 }
    };

    const jobs = await Job.find(query)
      .sort(sortOptions[sort] || sortOptions.newest)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('postedBy', 'name email');

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalJobs: total
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single job by ID
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get stats
app.get('/api/stats', async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const totalCompanies = await Job.distinct('company').then(companies => companies.length);
    const totalUsers = await User.countDocuments();
    res.json({ totalJobs, totalCompanies, totalUsers });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create new job (employers only)
app.post('/api/jobs', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can post jobs' });
    }

    const jobData = { ...req.body, postedBy: decoded.id };
    const job = await Job.create(jobData);
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Apply for job
app.post('/api/applications', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const { jobId, coverLetter, resume } = req.body;
    const application = await Application.create({ jobId, userId: decoded.id, resume: resume || 'dummy.pdf', coverLetter });
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user's applications
app.get('/api/applications', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const applications = await Application.find({ userId: decoded.id }).populate('jobId');
    res.json(applications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bookmark routes
app.post('/api/bookmarks', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const { jobId } = req.body;
    const bookmark = await Bookmark.create({ jobId, userId: decoded.id });
    res.status(201).json(bookmark);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/bookmarks/:jobId', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    await Bookmark.findOneAndDelete({ jobId: req.params.jobId, userId: decoded.id });
    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/bookmarks', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const bookmarks = await Bookmark.find({ userId: decoded.id }).populate('jobId');
    res.json(bookmarks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Health check route
app.get('/health', (req, res) => res.json({ ok: true }));

// Start server on port 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('✅ Server running on port', PORT));

