import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

let db;

export const connectDB = async () => {
  db = null;

  try {
    mongoose.set('strictQuery', false);

    let databaseURL = process.env.MONGO_URL;

    if (process.env.NODE_ENV === 'testing') {
      databaseURL = process.env.MONGO_TEST_URL;
    }

    await mongoose.connect(databaseURL);
    console.log('MongoDB connected successfully');
    db = mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit with failure code
  } finally {
    if (db !== null && db.readyState === 1) {
      // await db.close();
      // console.log("Disconnected successfully from db");
    }
  }
};

export const disconnectDB = async () => {
  await db.close();
  console.log('MongoDB disconnected successfully');
};
