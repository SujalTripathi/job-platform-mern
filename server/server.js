import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// NEW: Allow CORS from your Vercel frontend
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://your-app.vercel.app' // Replace with your actual Vercel URL later
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
  company: String,
  location: String,
  type: { type: String, enum: ['full-time', 'part-time', 'internship'], default: 'full-time' },
  skills: [String],
  description: String,
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, { timestamps: true }));

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

// Health check route
app.get('/health', (req, res) => res.json({ ok: true }));

// Start server on port 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('✅ Server running on port', PORT));

