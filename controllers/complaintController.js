import mongoose from 'mongoose';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import Department from '../models/Department.js';

function toPublicComplaint(complaint) {
  return {
    id: complaint._id,
    title: complaint.title,
    description: complaint.description,
    category: complaint.category,
    location: complaint.location,
    reportedBy: complaint.reportedBy,
    department: complaint.department,
    assignedTo: complaint.assignedTo,
    status: complaint.status,
    createdAt: complaint.createdAt,
    updatedAt: complaint.updatedAt,
  };
}

// POST /api/complaints
// Auth: verifyJWT + authorize('citizen')
// reportedBy always comes from req.user.id. Status is always "reported".
// Citizen cannot set department, assignedTo, or status.
export async function createComplaint(req, res) {
  try {
    const { title, description, category, location } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Title is required.' });
    }
    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ message: 'Description is required.' });
    }
    if (!category || typeof category !== 'string' || !category.trim()) {
      return res.status(400).json({ message: 'Category is required.' });
    }
    if (!location || typeof location !== 'string' || !location.trim()) {
      return res.status(400).json({ message: 'Location is required.' });
    }

    const complaint = await Complaint.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      location: location.trim(),
      reportedBy: req.user.id, // never trust reportedBy from the request body
      status: 'reported',
    });

    return res.status(201).json({ complaint: toPublicComplaint(complaint) });
  } catch (err) {
    console.error('createComplaint error:', err);
    return res.status(500).json({ message: 'Something went wrong while creating the complaint.' });
  }
}

// GET /api/complaints
// Auth: verifyJWT
// Citizen -> own complaints only. Authority -> complaints assigned to them.
// Admin -> all complaints. Filter is always built from req.user, never from
// query params supplied by the client.
export async function listComplaints(req, res) {
  try {
    let filter = {};

    if (req.user.role === 'citizen') {
      filter = { reportedBy: req.user.id };
    } else if (req.user.role === 'authority') {
      filter = { assignedTo: req.user.id };
    } else if (req.user.role === 'admin') {
      filter = {};
    } else {
      return res.status(403).json({ message: 'You do not have permission to view complaints.' });
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      complaints: complaints.map(toPublicComplaint),
    });
  } catch (err) {
    console.error('listComplaints error:', err);
    return res.status(500).json({ message: 'Something went wrong while listing complaints.' });
  }
}

// GET /api/complaints/:id
// Auth: verifyJWT
// Citizen can only view their own complaint. Authority can only view
// complaints assigned to them. Admin can view any complaint.
export async function getComplaintById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid complaint ID.' });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    const isOwner = complaint.reportedBy.toString() === req.user.id;
    const isAssignedAuthority =
      complaint.assignedTo && complaint.assignedTo.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (req.user.role === 'citizen' && !isOwner) {
      return res.status(403).json({ message: 'You do not have permission to view this complaint.' });
    }
    if (req.user.role === 'authority' && !isAssignedAuthority) {
      return res.status(403).json({ message: 'You do not have permission to view this complaint.' });
    }
    if (!isOwner && !isAssignedAuthority && !isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to view this complaint.' });
    }

    return res.status(200).json({ complaint: toPublicComplaint(complaint) });
  } catch (err) {
    console.error('getComplaintById error:', err);
    return res.status(500).json({ message: 'Something went wrong while fetching the complaint.' });
  }
}

// PUT /api/complaints/:id/assign
// Auth: verifyJWT + authorize('admin')
// Complaint must currently be "verified". Sets department, assignedTo,
// and moves status to "assigned" in one step.
export async function assignComplaint(req, res) {
  try {
    const { id } = req.params;
    const { department, assignedTo } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid complaint ID.' });
    }
    if (!department || !mongoose.Types.ObjectId.isValid(department)) {
      return res.status(400).json({ message: 'A valid department ID is required.' });
    }
    if (!assignedTo || !mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({ message: 'A valid assignedTo (authority user ID) is required.' });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    if (complaint.status !== 'verified') {
      return res.status(400).json({
        message: `Cannot assign a complaint with status "${complaint.status}". Complaint must be "verified" first.`,
      });
    }

    const departmentDoc = await Department.findById(department);
    if (!departmentDoc) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    const authorityUser = await User.findById(assignedTo);
    if (!authorityUser) {
      return res.status(404).json({ message: 'Assigned user not found.' });
    }
    if (authorityUser.role !== 'authority') {
      return res.status(400).json({ message: 'assignedTo must be a user with role "authority".' });
    }
    if (!authorityUser.department || authorityUser.department.toString() !== department) {
      return res.status(400).json({ message: 'The selected authority does not belong to the selected department.' });
    }

    complaint.department = departmentDoc._id;
    complaint.assignedTo = authorityUser._id;
    complaint.status = 'assigned';
    complaint.updatedAt = new Date();

    await complaint.save();

    return res.status(200).json({ complaint: toPublicComplaint(complaint) });
  } catch (err) {
    console.error('assignComplaint error:', err);
    return res.status(500).json({ message: 'Something went wrong while assigning the complaint.' });
  }
}

// Allowed transitions and who may perform each one.
// "verified -> assigned" is intentionally excluded here — that transition
// only happens through PUT /api/complaints/:id/assign.
const ALLOWED_TRANSITIONS = {
  reported: {
    verified: ['admin'],
  },
  assigned: {
    in_progress: ['authority'], // must also be the assigned authority
  },
  in_progress: {
    resolved: ['authority'], // must also be the assigned authority
  },
};

// PUT /api/complaints/:id/status
// Auth: verifyJWT
// Determines whether the current user may perform the requested transition
// based on req.user (role + id) — never trusts role/identity from the body.
export async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status: nextStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid complaint ID.' });
    }

    const validStatuses = ['reported', 'verified', 'assigned', 'in_progress', 'resolved'];
    if (!nextStatus || !validStatuses.includes(nextStatus)) {
      return res.status(400).json({ message: 'A valid status value is required.' });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    const currentStatus = complaint.status;

    if (currentStatus === 'verified' && nextStatus === 'assigned') {
      return res.status(400).json({
        message: 'Use PUT /api/complaints/:id/assign to move a complaint from "verified" to "assigned".',
      });
    }

    const transitionsFromCurrent = ALLOWED_TRANSITIONS[currentStatus] || {};
    const allowedRoles = transitionsFromCurrent[nextStatus];

    if (!allowedRoles) {
      return res.status(400).json({
        message: `Cannot change status from "${currentStatus}" to "${nextStatus}".`,
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this status change.' });
    }

    // For authority-performed transitions, the authority must be the one
    // assigned to this specific complaint.
    if (req.user.role === 'authority') {
      const isAssignedAuthority =
        complaint.assignedTo && complaint.assignedTo.toString() === req.user.id;
      if (!isAssignedAuthority) {
        return res.status(403).json({ message: 'You are not assigned to this complaint.' });
      }
    }

    complaint.status = nextStatus;
    complaint.updatedAt = new Date();

    await complaint.save();

    return res.status(200).json({ complaint: toPublicComplaint(complaint) });
  } catch (err) {
    console.error('updateStatus error:', err);
    return res.status(500).json({ message: 'Something went wrong while updating the complaint status.' });
  }
}
