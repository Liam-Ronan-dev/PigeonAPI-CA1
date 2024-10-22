import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit with failure code
  }
};
