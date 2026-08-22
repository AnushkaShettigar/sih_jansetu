import mongoose from 'mongoose';

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not configured.');
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    throw new Error('MongoDB connection failed.');
  }
}

export default connectDB;
