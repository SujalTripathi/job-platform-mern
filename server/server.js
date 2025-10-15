import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// NEW: Allow CORS from your Vercel frontend
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://your-app.vercel.app' // Replace with your actual Vercel URL later
];

// Connect to MongoDB (CHANGE THIS if using Atlas!)
const MONGO = process.env.MONGODB_URI;
// If using Atlas, replace above line with your connection string like:
// const MONGO = 'mongodb+srv://youruser:yourpassword@cluster.mongodb.net/jobapp';

await mongoose.connect(MONGO);
console.log('MongoDB connected!');

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
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json()); // Parse JSON from requests

// API Route 1: GET all jobs (with optional filters)
app.get('/api/jobs', async (req, res) => {
  const { q = '', location = '', type = '' } = req.query;
  
  const filter = {};
  if (q) filter.title = new RegExp(q, 'i'); // Search in title
  if (location) filter.location = new RegExp(location, 'i');
  if (type) filter.type = type;
  
  const jobs = await Job.find(filter).sort({ createdAt: -1 });
  res.json(jobs);
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

