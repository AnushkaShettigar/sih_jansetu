import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Department from '../models/Department.js';

const SALT_ROUNDS = 10;

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department || null,
    createdAt: user.createdAt,
  };
}

// POST /api/users/authority
// Auth: verifyJWT + authorize('admin')
// Creates an authority account. role is always hardcoded server-side.
export async function createAuthority(req, res) {
  try {
    const { name, email, password, department } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Name is required.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'A valid email is required.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    if (!department || !mongoose.Types.ObjectId.isValid(department)) {
      return res.status(400).json({ message: 'A valid department ID is required.' });
    }

    const departmentDoc = await Department.findById(department);
    if (!departmentDoc) {
      return res.status(400).json({ message: 'Department not found.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'authority', // hardcoded — client-supplied role is never used
      department: departmentDoc._id,
    });

    return res.status(201).json({ user: toPublicUser(user) });
  } catch (err) {
    console.error('createAuthority error:', err);
    return res.status(500).json({ message: 'Something went wrong while creating the authority account.' });
  }
}

// GET /api/users
// Auth: verifyJWT + authorize('admin')
// Optional query param: ?role=citizen|authority|admin
export async function listUsers(req, res) {
  try {
    const { role } = req.query;
    const filter = {};

    if (role) {
      if (!['citizen', 'authority', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role filter.' });
      }
      filter.role = role;
    }

    const users = await User.find(filter).select('-passwordHash');

    return res.status(200).json({
      users: users.map(toPublicUser),
    });
  } catch (err) {
    console.error('listUsers error:', err);
    return res.status(500).json({ message: 'Something went wrong while listing users.' });
  }
}

// GET /api/users/:id
// Auth: verifyJWT + authorize('admin')
export async function getUserById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const user = await User.findById(id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ user: toPublicUser(user) });
  } catch (err) {
    console.error('getUserById error:', err);
    return res.status(500).json({ message: 'Something went wrong while fetching the user.' });
  }
}
