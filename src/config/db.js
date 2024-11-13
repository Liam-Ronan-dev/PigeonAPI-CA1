import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  const dbUri =
    process.env.NODE_ENV === 'testing'
      ? process.env.MONGO_TEST_URL
      : process.env.MONGO_URL;

  try {
    await mongoose.connect(dbUri);
    console.log(`MongoDB connected successfully!`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};
