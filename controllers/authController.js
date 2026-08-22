import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const SALT_ROUNDS = 10;
const JWT_EXPIRY = '1d';

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function signToken(user) {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

// POST /api/auth/register
// Always creates a citizen. Any "role" field in the request body is ignored.
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Name is required.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'A valid email is required.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
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
      role: 'citizen', // hardcoded — client-supplied role is never used
    });

    const token = signToken(user);

    return res.status(201).json({
      token,
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ message: 'Something went wrong during registration.' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email) || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Generic message for both "no such user" and "wrong password"
    const invalidCredentials = () =>
      res.status(401).json({ message: 'Invalid email or password.' });

    if (!user) {
      return invalidCredentials();
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return invalidCredentials();
    }

    const token = signToken(user);

    return res.status(200).json({
      token,
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ message: 'Something went wrong during login.' });
  }
}

// GET /api/auth/me
// Requires verifyJWT to have run first (req.user is set).
async function me(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }
    return res.status(200).json({ user: toPublicUser(user) });
  } catch (err) {
    console.error('me error:', err);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}

export { register, login, me };
