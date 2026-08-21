import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['citizen', 'authority', 'admin'],
    default: 'citizen',
    required: true,
  },
  // Required only for authority accounts. Stays null/unset for
  // citizens and admins.
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    default: null,
    required: function () {
      return this.role === 'authority';
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
