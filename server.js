import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dns from 'dns';

// Fix DNS resolution issues on Windows/macOS for SRV records
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Setup file uploads directory
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// MongoDB Connection targeting the 'hackathon' database
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://khushalimistry_db_user:A1q8ko43vYRcwsMo@sih.oxkh9pc.mongodb.net/hackathon?appName=SIH';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected to "hackathon" database successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Schema matching your existing 'issues' collection
const issueSchema = new mongoose.Schema(
  {
    customId: { type: String },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, default: 'Medium' },
    status: { type: String, default: 'Pending' },
    citizen: { type: String, default: 'Anonymous' },
    location: { type: String, default: 'Ranchi, Jharkhand' },
    safetyRisk: { type: Boolean, default: false },
    additional: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

// AFTER (Fixed):
issueSchema.pre('save', async function () {
  if (!this.customId) {
    const count = await mongoose.model('Issue').countDocuments();
    const sequence = String(count + 1).padStart(4, '0');
    this.customId = `JS-${sequence}`;
  }
});

// Explicitly binding to the 'issues' collection inside 'hackathon' database
const Issue = mongoose.model('Issue', issueSchema, 'issues');

// =================================================================
// ROUTES
// =================================================================

// Create new report
app.post('/api/complaints', upload.single('image'), async (req, res) => {
  try {
    const { title, category, description, citizen, severity, priority, location, safetyRisk, additional } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newIssue = new Issue({
      title: title || `${category || 'Civic'} issue`,
      category: category || 'General',
      description: description || 'No description provided',
      citizen: citizen || 'Anonymous Citizen',
      priority: severity || priority || 'Medium', // Maps severity from frontend to priority in DB
      location: location || 'Ranchi, Jharkhand',
      safetyRisk: safetyRisk === 'true' || safetyRisk === true,
      additional: additional || '',
      imageUrl,
    });

    await newIssue.save();
    console.log('Saved new complaint:', newIssue.customId);
    res.status(201).json({ message: 'Issue recorded successfully', issue: newIssue });
  } catch (error) {
    console.error('Save Error:', error);
    res.status(500).json({ error: error.message || 'Failed to record issue.' });
  }
});

// Admin Stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const total = await Issue.countDocuments();
    const pending = await Issue.countDocuments({ status: 'Pending' });
    const inProgress = await Issue.countDocuments({ status: 'In Progress' });
    const resolved = await Issue.countDocuments({ status: 'Resolved' });

    res.status(200).json({ total, pending, inProgress, resolved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics.' });
  }
});

// Admin Reports Queue
app.get('/api/admin/reports', async (req, res) => {
  try {
    const reports = await Issue.find().sort({ createdAt: -1 });
    const formatted = reports.map((r) => ({
      id: r.customId || r._id,
      mongoId: r._id,
      title: r.title || r.description,
      category: r.category,
      priority: r.priority || 'Medium',
      status: r.status || 'Pending',
      citizen: r.citizen || 'Anonymous',
    }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch issues.' });
  }
});

// Admin Status Update
app.patch('/api/admin/reports/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Issue.findOneAndUpdate(
      { $or: [{ customId: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Issue not found.' });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update issue status.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});