import mongoose from 'mongoose';

export const COMPLAINT_STATUSES = [
  'reported',
  'verified',
  'assigned',
  'in_progress',
  'resolved',
  'closed',
  'reopened',
];

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    default: null,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  assignedAt: {
    type: Date,
    default: null,
  },
  inProgressAt: {
    type: Date,
    default: null,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
  resolutionVerifiedAt: {
    type: Date,
    default: null,
  },
  resolutionRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  reopenedAt: {
    type: Date,
    default: null,
  },
  reopenReason: {
    type: String,
    default: null,
    trim: true,
  },
  status: {
    type: String,
    enum: COMPLAINT_STATUSES,
    default: 'reported',
  },
  resolutionHistory: {
    type: [{
      resolvedAt: { type: Date, required: true },
      resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      resolutionVerifiedAt: { type: Date, default: null },
      resolutionRating: { type: Number, min: 1, max: 5, default: null },
    }],
    default: [],
  },
  reopenHistory: {
    type: [{
      reopenedAt: { type: Date, required: true },
      reopenedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      reason: { type: String, required: true, trim: true },
    }],
    default: [],
  },
  escalationLevel: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  escalatedAt: {
    type: Date,
    default: null,
  },
  escalationHistory: {
    type: [{
      fromLevel: { type: Number, required: true },
      toLevel: { type: Number, required: true },
      escalatedAt: { type: Date, required: true },
      reason: { type: String, required: true },
    }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
