import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB database is connected'))
    .catch((err) => {
      console.error(`Error connecting to DB: ${err}`);
    });
};
