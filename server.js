import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']); // Forces Node.js to use Google & Cloudflare DNS

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://khushalimistry_db_user:A1q8ko43vYRcwsMo@sih.oxkh9pc.mongodb.net/?appName=SIH';

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

// Multer Image Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Database Model
const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  category: { type: String, required: true },
  priorityScore: { type: Number, default: 0 },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
    address: { type: String },
  },
  upvotes: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

complaintSchema.index({ location: '2dsphere' });
const Complaint = mongoose.model('Complaint', complaintSchema);

// Helper Utility: AI Category Detection
const detectCategory = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('pothole') || text.includes('road') || text.includes('street')) return 'Roads';
  if (text.includes('garbage') || text.includes('trash') || text.includes('waste')) return 'Garbage';
  if (text.includes('water') || text.includes('pipe') || text.includes('leak')) return 'Water';
  if (text.includes('light') || text.includes('lamp') || text.includes('dark')) return 'Streetlights';
  if (text.includes('drain') || text.includes('flood') || text.includes('sewer')) return 'Drainage';
  return 'Infrastructure';
};

// Helper Utility: CPS (Priority Score) Calculator
const calculateCPS = (category) => {
  const weights = { Water: 40, Roads: 30, Streetlights: 20, Garbage: 25, Drainage: 35, Infrastructure: 15 };
  return 10 + (weights[category] || 10);
};

// --- ROUTES ---

// Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'JanSetu API is working!' });
});

// 1. CREATE COMPLAINT (Handled by ReportIssue component in App.jsx)
app.post('/api/complaints', upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, address, latitude, longitude } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required.' });
    }

    const detectedCat = category && category !== 'Other' ? category : detectCategory(title || '', description);
    const cps = calculateCPS(detectedCat);
    const coords = [parseFloat(longitude) || 85.3096, parseFloat(latitude) || 23.3441];

    const newComplaint = new Complaint({
      title: title || `${detectedCat} issue at ${address || 'Unknown Location'}`,
      description,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      category: detectedCat,
      priorityScore: cps,
      location: {
        type: 'Point',
        coordinates: coords,
        address: address || 'Ranchi, Jharkhand',
      },
    });

    await newComplaint.save();
    res.status(201).json({ success: true, data: newComplaint });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ error: 'Server error while saving complaint.' });
  }
});

// 2. GET ALL COMPLAINTS (Sorted by priority)
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ priorityScore: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. TRACK SINGLE COMPLAINT BY ID (Handled by TrackComplaint component in App.jsx)
app.get('/api/complaints/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: 'No complaint found with this ID.' });
    }
    res.json(complaint);
  } catch (error) {
    res.status(400).json({ error: 'Invalid Complaint ID format.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});